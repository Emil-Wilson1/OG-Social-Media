import { Types } from "mongoose";
import Message, { MessageDocument } from "../models/messageModel";
import Conversation from "../models/conversationModel";

class MessageRepository {
    async create(
        conversationId: string,
        sender: string,
        text: string,
        receiver: string,
        timestamp: number,
        messageType: string,
        replyTo:string
      ): Promise<MessageDocument> {
        try {
          const newMessage = new Message({
            conversationId,
            sender,
            receiver,
            text,
            messageType,
            timestamp,
            replyTo
          });
      
          const savedMessage = await newMessage.save();
          return savedMessage;
        } catch (error) {
          console.error('Error creating message:', error);
          throw new Error(`Failed to create message: ${error}`);
        }
      }
  async findMessagesByUserId(
    userId: string,
    receiverId: string
  ): Promise<MessageDocument[]> {
    try {
      const conversation = await Conversation.findOne({
        members: {
          $all: [new Types.ObjectId(userId), new Types.ObjectId(receiverId)],
        },
      });

      if (!conversation) {
        return [];
      }

      return await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    } catch (error) {
      throw new Error(`Failed to fetch messages for user ${userId}: ${error}`);
    }
  }

  async delete(messageId: string): Promise<boolean> {
    try {
      const result = await Message.deleteOne({ _id: messageId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting message from repository:', error);
      throw new Error(`Failed to delete message: ${error}`);
    }
  }

}

export const messageRepository = new MessageRepository();
