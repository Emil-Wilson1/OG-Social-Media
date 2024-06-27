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
  

export const messages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, receiverId } = req.params;
    const response = await messageService.getMessages(userId, receiverId);
    res.status(HttpStatusCode.OK).json(response);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Failed to fetch messages" });
  }
};
