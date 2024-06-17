import { Request, Response} from "express";
import notificationService from "../services/notificationService";
import { HttpStatusCode } from "../types/httpStatus";

export const notifications = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.params.userId;
      console.log(userId,"Notification thingss......");
      const notifications  = await notificationService.getNotifications(
        userId
      );

      console.log(notifications);
      
      res.status(HttpStatusCode.OK).json({notifications });
    } catch (error: unknown) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    }
  };
  
  export const dismissNotification = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const notificationId = req.params.id;
      const { success, message } = await notificationService.dismissNotification(
        notificationId
      );
      res.status(HttpStatusCode.OK).json({ success, message });
    } catch (error: unknown) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    }
  };

