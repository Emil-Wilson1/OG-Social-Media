import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  receiverId: {
    _id: mongoose.Types.ObjectId;
    fullname: string;
  };
  type: "like" | "comment" | "follow" | "birthday";
  sourceId: mongoose.Types.ObjectId;
  createdAt: Date;
  read: boolean;
}

const NotificationSchema: Schema = new Schema({
  sourceId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["like", "comment", "follow", "birthday"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const notificationModel = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

export default notificationModel;
