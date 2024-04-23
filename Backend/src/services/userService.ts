import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository';

class AuthService {
    async signup(fullname:string,email: string, username: string, password: string): Promise<string | null> {
        try {
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);
          
          // Create a new user with hashed password
          const user = await userRepository.createUser(fullname,email, username, hashedPassword);
          if (!user) {
            throw new Error('User creation failed');
          }
    
          // Generate JWT token
          const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY_SECRET || '', { expiresIn: '1h' });
          return token;
        } catch (error) {
          console.error('Error in signup:', error);
          return null;
        }
      }

  async login(email: string, password: string): Promise<string | null> {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;
    
    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) return null;

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY_SECRET || '', { expiresIn: '1h' });
    return token;
  }
}

export default new AuthService();