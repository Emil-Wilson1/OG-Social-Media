import reportUserModel,{ ReportDoc } from './../models/reportModel';

import { Model } from 'mongoose';
import AdminModel, { IAdmin } from '../models/adminModel';
import User, { UserDocument } from '../models/userModel';
import Post,{ PostDocument } from '../models/postModel';

export class AdminRepository {
    private adminModel: Model<IAdmin>;
    private userModel: Model<UserDocument>;
    private reportModel:Model<ReportDoc>
    private postUserModel: Model<PostDocument>;

    constructor() {
        this.adminModel = AdminModel;
        this.userModel = User;
        this.reportModel=reportUserModel
        this.postUserModel = Post;

    }
 
    async findByEmail(email: string): Promise<IAdmin | null> {
        return await this.adminModel.findOne({ email }).exec();
    }

    async insertUser(email: string, hashedPassword: string): Promise<IAdmin> {
        try {
          const newUser = new this.adminModel({
            email: email,
            password: hashedPassword 
          });
          
          const savedUser = await newUser.save();
          return savedUser;
        } catch (error) {
          console.error('Error inserting user:', error);
          throw error; 
        }
      }


      async getAllUsers(): Promise<UserDocument[]> {
        const verifiedUsers=await this.userModel.find({verified:true}).exec();
        return verifiedUsers
      }

      async blockUser(userId: string): Promise<void> {
        try {
          await this.userModel.findByIdAndUpdate(userId, { blocked: true });
        } catch (error) {
          throw new Error('Error blocking user in MongoDB');
        }
      }

      async unblockUser(userId: string): Promise<void> {
        try {
          await this.userModel.findByIdAndUpdate(userId, { blocked: false });
        } catch (error) {
          throw new Error('Error blocking user in MongoDB');
        }
      }


      async updateActionTaken(id: string): Promise<void> {
        await this.reportModel.findByIdAndUpdate(id, { actionTaken: true });
    }

    async updateAction(id: string): Promise<void> {
      await this.reportModel.findByIdAndUpdate(id, { actionTaken: false});
  }

  async blockPostById(postId: string): Promise<void> {
    await this.postUserModel.findByIdAndUpdate(postId, { adminBlock: true });
}

async unblockPostById(postId: string): Promise<void> {
  await this.postUserModel.findByIdAndUpdate(postId, { adminBlock: false});
}

}

export default new AdminRepository()