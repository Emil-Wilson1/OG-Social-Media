import { model, Schema } from 'mongoose';
import { Document, Types } from "mongoose";

export interface Message {
  conversationId: string;
  sender: Types.ObjectId;
  receiver:Types.ObjectId;
  text: string;
  messageType:string;
  attachment: { 
    type: string;
    url: string;
    filename: string;
    size: number;
  };
  replyTo:Types.ObjectId;
  isRead:boolean;
  timestamp:number
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageDocument extends Message, Document {}
const MessageSchema = new Schema<MessageDocument>(
  {
    conversationId: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },  
    text: {
      type: String,
      required: true,
    },
    messageType:{
      type:String,
      required: false,
    
    },
    replyTo: { type:Schema.Types.ObjectId, ref: 'Message', default: null },
    attachment: {
      type: {
        type: String,
        enum: ['image', 'video', 'file','audio'],
      },
      url: String,
      filename: String,
      size: Number,
    },
    timestamp:{
        type:Number
    },
    isRead:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);


const Message = model<MessageDocument>('Message', MessageSchema);

export default Message;