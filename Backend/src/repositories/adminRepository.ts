
import { Model } from 'mongoose';
import AdminModel, { IAdmin } from '../models/adminModel';
import User, { UserDocument } from '../models/userModel';

export class AdminRepository {
    private adminModel: Model<IAdmin>;
    private userModel: Model<UserDocument>;

    constructor() {
        this.adminModel = AdminModel;
        this.userModel = User;

    }
 
    async findByEmail(email: string): Promise<IAdmin | null> {
        return await this.adminModel.findOne({ email }).exec();
    }

    async insertUser(email: string, hashedPassword: string): Promise<IAdmin> {
        try {
          const newUser = new this.adminModel({
            email: email,
            password: hashedPassword // Store the hashed password
          });
          
          const savedUser = await newUser.save();
          return savedUser;
        } catch (error) {
          console.error('Error inserting user:', error);
          throw error; // Propagate the error to the caller
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

}

export default new AdminRepository()