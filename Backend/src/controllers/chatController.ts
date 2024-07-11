import { Request, Response } from 'express';
import { messageService } from '../services/messageService';
import { HttpStatusCode } from '../types/httpStatus';


// export const saveMessage = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const response = await messageService.saveMessage(req.body);
//     res.status(HttpStatusCode.OK).json(response);
//   } catch (error) {
//     res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Failed to save message" });
//   }
// };

export const saveMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await messageService.saveMessage(req.body);
      console.log('Message saved successfully:', response); // Log successful saving
  
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      console.error('Error saving message:', error); // Log any errors
  
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to save message"
      });
    }
  };


  export const deleteMessageController = async (req: Request, res: Response): Promise<void> => {
    const { messageId } = req.params;
    
    try {
      const response = await messageService.deleteMessage(messageId);
      console.log('Message deleted successfully:', response);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to delete message',
      });
    }
  };

  

export const messages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, receiverId } = req.params;
    const response = await messageService.getMessages(userId, receiverId);
    res.status(HttpStatusCode.OK).json(response);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Failed to fetch messages" });
  }
}


export const getActiveConversations = async (req: Request, res: Response) => {
  try {
    const activeConversations = await messageService.getActiveConversations();
    res.status(200).json(activeConversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load active conversations' });
  }
};

export const saveActiveConversation = async (req: Request, res: Response) => {
  try {
    const { receiverName, receiverId, profileImg } = req.body;
    const newConversation = await messageService.saveActiveConversation({
      receiverName,
      receiverId,
      profileImg,
    } as any);
    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save active conversation' });
  }
};


