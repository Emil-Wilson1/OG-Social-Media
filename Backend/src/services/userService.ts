import JWTUtil  from './../utils/jwt';
import nodemailer from './../utils/nodemailer';
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
          // const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY_SECRET || '', { expiresIn: '1h' });
          const token=JWTUtil.generateAccessToken(user._id)
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



  async sendPasswordResetEmail(email: string): Promise<string> {
    try {
      // Check if the user exists
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return 'User not found';
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).slice(-8);

      // Update user's reset token in the database
      await userRepository.updateResetToken(email, resetToken);

      // Send reset password link to the user's email
      const resetLink = `http://localhost:4200/forgot?token=${resetToken}`;

      await nodemailer.sendReset(email,resetLink) 

      return 'Reset password link sent successfully';
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }



  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await userRepository.findByResetToken(token);
    if (!user) {
      throw new Error('Invalid or expired token');
    }

    await userRepository.updatePassword(user.id, newPassword);
  }

}









export default new AuthService();