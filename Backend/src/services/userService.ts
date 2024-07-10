
import nodemailer from './../utils/nodemailer';
import sendOTP from './../utils/nodemailer'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository, { UserRepository } from '../repositories/userRepository';
import cloudinary from 'cloudinary';
import generateOTP from '../utils/generateOtp';
import User, { UserDocument } from '../models/userModel';
import { UserProfileUpdate } from '../types/interfaces';
import notificationRepository from '../repositories/notificationRepository';

class AuthService {


  constructor(private userRepository: UserRepository, private mailer: { sendOTP: (email: string, otp: number) => Promise<void> }) { }

  async signup(fullname: string, email: string, username: string, password: string): Promise<void> {
    try {
      if (await this.userRepository.findByEmail(email)) {
        throw new Error('User already exists!');
      }
      const existingUser = await this.userRepository.findByUsername(username);
      if (existingUser) {
        throw new Error('Username is already taken');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userRepository.createUser(fullname, email, username, hashedPassword);
      if (!user) {
        throw new Error('User creation failed');
      }
      const otp = generateOTP();
      console.log(otp)
      const savedOTP = await this.userRepository.saveOTP(email, otp);
      if (!savedOTP) {
        throw new Error('Failed to save OTP');
      }
      await this.mailer.sendOTP(email, otp);
      setTimeout(async () => {
        try {
          await this.userRepository.deleteOTP(email);
          console.log('OTP deleted successfully after 90 seconds');
        } catch (error) {
          console.error('Error deleting OTP:', error);
        }
      }, 50000);
    } catch (error) {
      if ((error as Error).message === 'User already exists!') {
        console.error('User already exists:', error);
        throw new Error('User already exists');
      } else if ((error as Error).message === 'Username is already taken') {
        console.error('Username is already taken:', error);
        throw new Error('Username is already taken');
      } else {
        console.error('Error signing up user:', error);
        throw new Error('Failed to create user');
      }
    }
  }


  async sendOTP(email: string): Promise<boolean> {
    const otp = generateOTP();
    const savedOTP = await this.userRepository.saveOTP(email, otp);

    if (!savedOTP) {
      return false;
    }

    await this.mailer.sendOTP(email, otp);

    setTimeout(async () => {
      try {
        await this.userRepository.deleteOTP(email);
        console.log('OTP deleted successfully after 90 seconds');
      } catch (error) {
        console.error('Error deleting OTP:', error);
      }
    }, 50000);

    return true;
  }



  async getUserIdFromToken(token: string): Promise<string | null> {
    try {
      const decodedToken = jwt.decode(token) as { userId?: string };
      const userId = decodedToken?.userId;
      console.log("decoding token:", userId)
      return userId || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // async login(email: string, password: string): Promise<string | { passMatch: string } | { emailMatch: string }> {
  //   const user = await userRepository.findByEmail(email);
  //   if (!user){
  //     return { emailMatch:"Email Not Found!"}
  //   } 
  //   const isPasswordValid = await bcrypt.compare(password, user.password || '');
  //   if (!isPasswordValid) {
  //     return { passMatch: "Incorrect password" };
  //   }
  //   const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY_SECRET || '', { expiresIn: '1h' });
  //   return token;
  // }


  async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string } | { emailMatch: string } | { passMatch: string } | {blocked:string}> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { emailMatch: "Email Not Found!" };
    }

    const isBlocked=await userRepository.findUserBlocked(email)
    if(isBlocked){
      return { blocked:"User is blocked"}
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return { passMatch: "Incorrect password" };
    }

    const accessToken = jwt.sign({ userId: user._id }, "your_secret_key_here", { expiresIn: '1hr' });

    const refreshToken = jwt.sign({ userId: user._id }, "your_secret_key_here",{ expiresIn: '7d' });

    return { accessToken, refreshToken };
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


  async createUserFromTemp(email: string): Promise<UserDocument | null> {
    const tempUser = await this.userRepository.findByEmailTemp(email);
    if (!tempUser) {
      return null;
    }

    const newUser: UserDocument = new User({
      email: tempUser.email,
      fullname: tempUser.fullname,
      password: tempUser.password,
      username: tempUser.username,
      verified: true,
    });

    await newUser.save();
    return newUser;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const result = await cloudinary.v2.uploader.upload(file.path);
      console.log("cloudinary image:", result);
      return result.secure_url;
    } catch (error) {
      throw new Error('Error uploading image to Cloudinary');
    }
  }


  async fetchUserById(id: string) {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID parameter');
    }
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }


  async updateProfile(userId: string, updates: UserProfileUpdate): Promise<void> {
    await this.userRepository.updateUserProfile(userId, updates);
  }
  async sendPasswordResetEmail(email: string): Promise<string> {
    try {

      const user = await userRepository.findByEmail(email);
      if (!user) {
        return 'User not found';
      }
      const resetToken = Math.random().toString(36).slice(-8);

      await userRepository.updateResetToken(email, resetToken);

      const resetLink = `http://localhost:4200/forgot?token=${resetToken}`;

      await nodemailer.sendReset(email, resetLink)
      setTimeout(async () => {
        try {
          await userRepository.removeResetToken(email, resetToken);
          console.log('Reset token deleted for user:', email);
        } catch (error) {
          console.error('Error deleting reset token for user:', email, error);
        }
      }, 5 * 60 * 1000); // 5 minutes in milliseconds

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


  async followUser(followerId: string, userId: string): Promise<void> {
    await userRepository.followUser(followerId, userId);
  }

async sendFollowReq(followerId: string, userId: string): Promise<void> {
  const userToFollow = await userRepository.findUserById(followerId);
  if (!userToFollow) {
    throw new Error("User to follow not found");
  } 
  if (userToFollow.isPrivate) {
    await userRepository.addFollowRequest(followerId, userId);
  }
}

async cancelFollowReq(followerId: string, userId: string): Promise<void> {
  const userToFollow = await userRepository.findUserById(followerId);
  if (!userToFollow) {
    throw new Error("User to follow not found");
  } 
  if (userToFollow.isPrivate) {
    await userRepository.removeFollowRequest(followerId, userId);
  }
}

async acceptFollowReq(followerId: string, userId: string): Promise<void> {
  const userToFollow = await userRepository.findUserById(followerId);
  if (!userToFollow) {
    throw new Error("User to follow not found");
  } 
  if (userToFollow.isPrivate) {
    await userRepository.acceptFollowRequest(followerId, userId);
  }
}


  async unfollowUser(followerId: string, userId: string): Promise<void> {
    await userRepository.unfollowUser(followerId, userId);
  }

  async acceptFollowRequest(followerId: string, userId: string): Promise<void> {
    await userRepository.acceptFollowRequest(followerId, userId);
  }
  
  async rejectFollowRequest(followerId: string, userId: string): Promise<void> {
    await userRepository.rejectFollowRequest(followerId, userId);
  }

  async togglePrivacy(userId: string): Promise<UserDocument | null> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newPrivacyStatus = !user.isPrivate;
    return this.userRepository.updatePrivacy(userId, newPrivacyStatus);
  }


}









export default new AuthService(userRepository, sendOTP);