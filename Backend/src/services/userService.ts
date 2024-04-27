
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository';
import cloudinary from 'cloudinary';


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

      async getUserIdFromToken(token: string): Promise<string | null> {
        try {
          // Decode the JWT token payload without verification
          const decodedToken = jwt.decode(token) as { userId?: string };
      
          // Extract the userId from the decoded token if available
          const userId = decodedToken?.userId;
      console.log("decoding token:",userId)
          // Return the userId if defined, or null if not present
          return userId || null;
        } catch (error) {
          // Log any decoding error and return null
          console.error('Error decoding token:', error);
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
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const result = await cloudinary.v2.uploader.upload(file.path);
      console.log("cloudinary image:",result);
      return result.secure_url;
    } catch (error) {
      throw new Error('Error uploading image to Cloudinary');
    }
  }

}









export default new AuthService();