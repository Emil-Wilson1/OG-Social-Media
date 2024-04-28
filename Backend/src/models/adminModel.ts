import mongoose, { Document, Schema } from 'mongoose';


export interface IAdmin extends Document {
  email: string;
  password: string;
}


const adminSchema = new Schema<IAdmin>({
  email: { type: String, required: true },
  password: { type: String, required: true }
});


const AdminModel = mongoose.model<IAdmin>('Admin', adminSchema);
export default AdminModel;
