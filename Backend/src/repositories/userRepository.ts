import { Model } from 'mongoose';
import User, { UserDocument } from '../models/userModel';

export class UserRepository {
    private userModel: Model<UserDocument>;

    constructor() {
        this.userModel = User;
    }

  
    async createUser(fullname:string,email: string, username: string, password: string): Promise<UserDocument> {
        const newUser = await this.userModel.create({ fullname,email, username, password });
        return newUser;
      }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ email }).exec();
    }
}

export default new UserRepository()


