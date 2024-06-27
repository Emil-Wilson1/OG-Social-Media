import mongoose, { Model } from "mongoose";
import Notifications,{ INotification } from "../models/notificationModel";

export class NotificationRepository {
    private notificationsModel: Model<INotification>;

    constructor() {
        this.notificationsModel = Notifications;
    }

    async saveNotification(userId:  string, followerId: string, type: string): Promise<INotification | null> {
        try {
          const newNotification = new this.notificationsModel({
            sourceId: followerId, 
            receiverId:userId,
            type: type,
          });
          const savedNotification = await newNotification.save();
          return savedNotification;
        } catch (error) {
          throw new Error(`Failed to create notification: ${error}`);
        }
      }
    
      async findNotifications(userId: string): Promise<INotification[]> {
        try {
          const notifications = await this.notificationsModel.find({}).sort({createdAt: -1}).populate('sourceId', 'fullname')
          console.log(notifications,"Repositoy");
          return notifications;
         
          
        } catch (error) {
          throw new Error(`Failed to fetch notifications: ${error}`);
        }
      }
    
      async deleteNotification(notificationId: string): Promise<boolean> {
        try {
          await this.notificationsModel.findByIdAndDelete(notificationId);
          return true
        } catch (error) {
          throw new Error(`Failed to fetch notifications: ${error}`);
        }
      }
  

}


export default new NotificationRepository()