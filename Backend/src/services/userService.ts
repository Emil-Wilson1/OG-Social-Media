import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository';

class AuthService {
    async signup(fullname:string,email: string, username: string, password: string): Promise<string | null> {
        try {
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);
          
          // Create a new user with hashed password
          const user = await userRepository.createUser(fullname,email,username, hashedPassword);
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

  async login(email: string, password: string): Promise<string | { passMatch: string } | { emailMatch: string }> {
    const user = await userRepository.findByEmail(email);
    if (!user){
      return { emailMatch:"Email Not Found!"}
    } 
    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return { passMatch: "Incorrect password" };
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY_SECRET || '', { expiresIn: '1h' });
    return token;
  }

  async verifyOTP(email: string, otp: number): Promise<boolean> {
    try {
      const user = await userRepository.findByEmailTemp(email);
      if (!user || user.otp !== otp) {
        throw new Error('Invalid OTP');
      }
        return true; 

    } catch (error) {
      console.error('Error during OTP verification:', error);
      throw new Error('Failed to verify OTP');
    }
  }
}









export default new AuthService();