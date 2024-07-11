import { Schema, model, Document } from 'mongoose';

interface conversation extends Document {
  receiverName: string;
  receiverId: string;
  profileImg: string;
}

const conversationSchema = new Schema({
  receiverName: { type: String, required: true },
  receiverId: { type: String, required: true },
  profileImg: { type: String, required: true },
});

const ConversationModel = model<conversation>('Convo', conversationSchema);

export { ConversationModel, conversation };
