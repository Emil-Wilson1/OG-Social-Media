
import { Model } from 'mongoose';
import User, { UserDocument } from '../models/userModel';


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


  
}

export default new UserRepository()


