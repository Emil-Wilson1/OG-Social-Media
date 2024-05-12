import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface PostModel extends Document {
  userId: Types.ObjectId;
  image: string;
  description?: string;
  date: Date;
  likes: Types.ObjectId[];
  saved: Types.ObjectId[];
  comments:Types.ObjectId[];
  hidden: boolean;
  blocked: boolean;
  adminBlock: boolean;
  deleted: boolean;
}

export interface PostDocument extends PostModel,Document {}


const postSchema = new Schema<PostDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxLength: 100,
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  saved: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
}],
  hidden: {
    type: Boolean,
    default: false,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  adminBlock: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

 const postUserModel = mongoose.model<PostDocument>("Post", postSchema);

export default postUserModel;