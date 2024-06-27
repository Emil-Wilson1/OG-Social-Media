import { model, Schema } from "mongoose";
import { Document,Types } from "mongoose";

export interface Conversation {
  members: Types.ObjectId[];
  isGroup:boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationDocument extends Conversation, Document {}



const ConversationSchema = new Schema<ConversationDocument>(
  {
    members: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      required: true,
    },
  
  },
  { timestamps: true }
);

const Conversation = model<ConversationDocument>(
  "Conversation",
  ConversationSchema
);

export default Conversation;