
import mongoose, { Model } from 'mongoose';
import User, { UserDocument } from '../models/userModel';
import bcrypt from 'bcryptjs';

import tempUser,{ tempUserDocument } from '../models/tempUserModel';
import { log } from 'console';

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

    async findByUsername(username: string): Promise<UserDocument | null> {
      return await this.userModel.findOne({ username }).exec();
  }

  async findUserBlocked(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? user.blocked : false;
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
          { $unset: { otp: 1 } }, 
          { new: true } 
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

    async removeResetToken(email: string, resetToken: string): Promise<void> {
      // Assuming your user schema has a `resetToken` field
      const user = await this.findByEmail(email);
      if (user && user.resetToken === resetToken) {
        user.resetToken = '';
        await user.save(); // Save changes to the database
      }
    }


    async findByResetToken(token: string): Promise<UserDocument | null> {
      try {

        const user = await this.userModel.findOne({ resetToken: token });
  
        return user ;
      } catch (error) {
        console.error('Error finding user by reset token:', error);
        throw error;
      }
    }
  
    async updatePassword(userId: string, newPassword: string): Promise<void> {
      try {

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });
  
        console.log('Password updated successfully');
      } catch (error) {
        console.error('Error updating password:', error);
        throw error;
      }
    }

    async isFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
      try {
        const currentUser = await User.findById(currentUserId).exec();
  
        if (!currentUser) {
          throw new Error('Current user not found');
        }
  
        // Check if the targetUserId is in the currentUser's following list
        return currentUser.following.includes(new mongoose.Types.ObjectId(targetUserId));
      } catch (error) {
        console.error('Error checking follow status:', error);
        throw error;
      }
    }
    async followUser(followerId: string, userId: string): Promise<void> {
      await this.userModel.findByIdAndUpdate(followerId, { $push: { following: userId } });
      await this.userModel.findByIdAndUpdate(userId, { $push: { followers: followerId } });
    }
  
    async unfollowUser(followerId: string, userId: string): Promise<void> {
      await this.userModel.findByIdAndUpdate(followerId, { $pull: { following: userId } });
      await this.userModel.findByIdAndUpdate(userId, { $pull: { followers: followerId } });
    }


    async findUsersWithUpcomingBirthdays(): Promise<UserDocument[]> {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
  
      return User.find({
        birthdate: {
          $gte: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0),
          $lt: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59)
        }
      }).exec();
    }

    async updatePrivacy(userId: string, isPrivate: boolean): Promise<UserDocument | null> {
      return this.userModel.findByIdAndUpdate(
        userId,
        { isPrivate },
        { new: true }
      ).exec();
    }

    async addFollowRequest(followerId: string, userId: string): Promise<void> {
     await this.userModel.findByIdAndUpdate(followerId, { $push: { followRequests: userId} }); 
    }

    async removeFollowRequest(followerId: string, userId: string): Promise<void> {
      await this.userModel.findByIdAndUpdate(followerId, { $pull: { followRequests: userId} }); 
     }

    async acceptFollowRequest(followerId: string, userId: string): Promise<void> {
      await this.userModel.findByIdAndUpdate(followerId, {
        $push: { followers: userId },
        $pull: { followRequests: userId }
      });
      await this.userModel.findByIdAndUpdate(userId , { $push: { following: followerId} });
    }
    
    async rejectFollowRequest(followerId: string, userId: string): Promise<void> {
      await this.userModel.findByIdAndUpdate(userId, { $pull: { followRequests: followerId } });
    }
}

export default new UserRepository()


