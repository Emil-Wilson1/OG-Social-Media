import Conversation from '../models/conversationModel';
import { conversation } from '../models/convoLists';
import Message from '../models/messageModel';
import { conversationRepo } from '../repositories/conversationRepository';
import { messageRepository } from '../repositories/messageRepository';

class MessageService {
//   async saveMessage(messageData: {
//     _id: string,
//     messageText: string,
//     receiver: string,
//     timestamp: number,
//     messageType: string
//   }) {
//     const { _id, messageText, receiver, timestamp, messageType } = messageData;

//     let conversation = await conversationRepo.findOneByMember(_id);

//     if (!conversation) {
//       conversation = await conversationRepo.create([_id, receiver]);
//     }

//     await messageRepository.create(
//       conversation._id ? conversation._id.toString() : null,
//       _id,
//       messageText,
//       receiver,
//       timestamp,
//       messageType
//     );

//     const conversationId = conversation._id ? conversation._id.toString() : null;

//     return {
//       success: true,
//       message: "Message saved successfully",
//       conversationId,
//     };
//   }

async saveMessage(messageData: {
    senderId: string,
    text: string,
    receiverId: string,
    timestamp: number,
    messageType: string,
    replyTo: string
  }) {
    const { senderId, text, receiverId, timestamp, messageType,replyTo } = messageData;
    let conversation;
    try {
      conversation = await conversationRepo.findOneByMember(senderId);
      console.log('Found conversation:', conversation);
    } catch (error) {
      console.error('Error finding conversation:', error);
      throw error; // Optionally rethrow the error to propagate it up the stack
    }
  
    if (!conversation) {
      try {
        conversation = await conversationRepo.create([senderId, receiverId]);
        console.log('Created new conversation:', conversation);
      } catch (error) {
        console.error('Error creating conversation:', error);
        throw error; // Optionally rethrow the error to propagate it up the stack
      }
    }
  
    try {
      await messageRepository.create(
        conversation._id ? conversation._id.toString() : null,
        senderId,
       text,
       receiverId,
        timestamp,
        messageType,
       replyTo
      );
      console.log('Message created successfully');
    } catch (error) {
      console.error('Error creating message:', error);
      throw error; // Optionally rethrow the error to propagate it up the stack
    }
  
    const conversationId = conversation._id ? conversation._id.toString() : null;
  
    console.log('Returning response with conversationId:', conversationId);
  
    return {
      success: true,
      message: "Message saved successfully",
      conversationId,
    };
  }
  
   async deleteMessage (messageId: string): Promise<{ success: boolean, message: string }>{
    try {
      const result = await messageRepository.delete(messageId);
      if (result) {
        console.log('Message deleted successfully');
        return { success: true, message: 'Message deleted successfully' };
      } else {
        console.error('Message not found');
        return { success: false, message: 'Message not found' };
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  async getMessages(userId: string, receiverId: string) {
    try {
      // Log the incoming parameters
      console.log('getMessages called with:', { userId, receiverId });
  
      const userConversations = await Conversation.find({ members: userId });
      console.log('User Conversations:', userConversations);
  
      const receiverConversations = await Conversation.find({ members: receiverId });
      console.log('Receiver Conversations:', receiverConversations);
  
      const userConvIds = userConversations.map((conv) => conv._id.toString());
      console.log('User Conversation IDs:', userConvIds);
  
      const receiverConvIds = receiverConversations.map((conv) => conv._id.toString());
      console.log('Receiver Conversation IDs:', receiverConvIds);
  
      const sentMessages = await Message.find({
        conversationId: { $in: userConvIds },
        sender: userId,
        receiver: receiverId,
      });
      console.log('Sent Messages:', sentMessages);
  
      const receivedMessages = await Message.find({
        conversationId: { $in: receiverConvIds },
        sender: receiverId,
        receiver: userId,
      });
      console.log('Received Messages:', receivedMessages);
  
      return {
        success: true,
        sentMessages,
        receivedMessages
      };
    } catch (error) {
      console.error('Error in getMessages:', error);
      return {
        success: false,
        error: error
      };
    }
  }

  async getActiveConversations(): Promise<conversation[]> {
    return conversationRepo.getActiveConversations();
  }

  async saveActiveConversation(conversation: conversation): Promise<conversation> {
    return conversationRepo.saveActiveConversation(conversation);
  }
}  

export const messageService = new MessageService();
