import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  fullname: string;
  password: string;
  username: string;
  otp?: number;
  createdAt: Date;
}
export interface tempUserDocument extends IUser, Document {}

const tempSchema = new Schema<tempUserDocument>({
  email: { type: String, required: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  otp: { type: Number },
  createdAt: { type: Date, default: Date.now, expires: 1800 },
});

tempSchema.index({ createdAt: 1 }, { expireAfterSeconds: 0 });

const tempUserModel = mongoose.model<tempUserDocument>("tempUser", tempSchema);
export default tempUserModel;
