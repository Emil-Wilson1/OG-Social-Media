import mongoose, { Document, Schema } from 'mongoose';

// Define the User interface for TypeScript
interface IUser extends Document {
  email: string;
  fullname: string;
  password: string;
  username: string;
  otp?:number;
  createdAt: Date;
}
export interface tempUserDocument extends IUser, Document {}
// Define the Mongoose schema for User
const tempSchema = new  Schema<tempUserDocument>({
  email: { type: String, required: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  otp:{type:Number},
  createdAt: { type: Date, default: Date.now, expires: 1800 } 
});

// Create a TTL index on the `createdAt` field
tempSchema.index({ createdAt: 1 }, { expireAfterSeconds: 0 });

// Create and export the User model based on the schema
const tempUserModel = mongoose.model<tempUserDocument>('tempUser', tempSchema);
export default tempUserModel;
