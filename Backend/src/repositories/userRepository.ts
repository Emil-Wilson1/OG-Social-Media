
import { Model } from 'mongoose';
import User, { UserDocument } from '../models/userModel';
import bcrypt from 'bcryptjs';

import tempUser,{ tempUserDocument } from '../models/tempUserModel';

export class UserRepository {
    private userModel: Model<UserDocument>;
    private tempUserModel:Model<tempUserDocument>

    constructor() {
        this.userModel = User;
        this.tempUserModel=tempUser;
    }

  
    async createUser(fullname:string,email: string, username: string, password: string): Promise<tempUserDocument> {
        const newUser = await this.tempUserModel.create({ fullname,email, username, password,createdAt:new Date()});
        return newUser;
      }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ email }).exec();
    }

    async findByEmailTemp(email: string): Promise<tempUserDocument | null> {
        return await this.tempUserModel.findOne({ email }).exec();
    }

   
    async saveOTP(email: string, otp: number): Promise<tempUserDocument | null> {
        try {
            const existingUser = await this.tempUserModel.findOne({ email });

            if (existingUser) {
                existingUser.otp = otp;
                const updatedUser = await existingUser.save();
                return updatedUser;
            } else {
                const newUser = await this.tempUserModel.create({ email, otp });
                return newUser;
            }
        } catch (error) {
            console.error('Error saving OTP:', error);
            return null;
        }
    }

    async deleteOTP(email: string): Promise<void> {
        await this.tempUserModel.findOneAndUpdate(
          { email },
          { $unset: { otp: 1 } }, // Unset the 'otp' field
          { new: true } // Return the updated document after modification
        ).exec();
      }


      async findUserById(userId: string): Promise<UserDocument | null> {
        try {
          const user = await this.userModel
            .findOne({ _id: userId })
            .exec()
          return user;
        } catch (error) {
          console.error(`Error fetching user by ID ${userId}:`, error);
          throw new Error('Failed to fetch user');
        }
      }


      async updateUserProfile(userId: string, updatedData: Partial<UserDocument>): Promise<UserDocument | null> {
        try {
          const user = await this.userModel.findOneAndUpdate({ _id: userId }, updatedData, { new: true });
          console.log("User details from userRepo:",user);
          return user;
        } catch (error) {
          console.error(`Error updating user profile for ID ${userId}:`, error);
          throw new Error('Failed to update user profile');
        }
      }
      async updateResetToken(email: string, resetToken: string): Promise<void> {
        await this.userModel.updateOne({ email }, { resetToken }).exec();
    }


    async findByResetToken(token: string): Promise<UserDocument | null> {
      try {
        // Find user by reset token in the database
        const user = await this.userModel.findOne({ resetToken: token });
  
        return user ;
      } catch (error) {
        console.error('Error finding user by reset token:', error);
        throw error;
      }
    }
  
    async updatePassword(userId: string, newPassword: string): Promise<void> {
      try {
        // Update user's password in the database
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });
  
        console.log('Password updated successfully');
      } catch (error) {
        console.error('Error updating password:', error);
        throw error;
      }
    }

}

export default new UserRepository()


