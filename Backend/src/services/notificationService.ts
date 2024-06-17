
import notificationRepository,{ NotificationRepository } from '../repositories/notificationRepository';


class NotificationService {

    constructor( private notificationRepository:NotificationRepository) { }
    async getNotifications(userId: string) {
        try { 
          const notifications = await this.notificationRepository.findNotifications(
            userId
          );
          return  notifications ;
        } catch (error) {
          throw new Error("Something went wrong");
        }
      }
    
      async dismissNotification(notificationId: string) {
        try {
          const notificationData = await this.notificationRepository.deleteNotification(
            notificationId
          );
          if (notificationData) {
            return { success: true, message: "Notification deleted" };
          } else {
            throw new Error("Notification not found");
          }
        } catch (error) {
          throw new Error("Something went wrong");
        }
      }

}

export default new NotificationService (notificationRepository)