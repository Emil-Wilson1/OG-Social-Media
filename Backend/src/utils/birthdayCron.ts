import cron from 'node-cron';
import userRepository from '../repositories/userRepository';
import notificationRepository from '../repositories/notificationRepository';

export const startBirthdayCron = (io:any) => {
  const checkBirthdays = async () => {
    const users = await userRepository.findUsersWithUpcomingBirthdays();
    console.log(users);
    users.forEach(async user => {
      const message = `It's ${user.fullname}'s birthday tomorrow!`;
      console.log(user);

      io.emit('birthdayNotification', {
        message: message
      });


      user.followers.forEach(async followerId => {
        const folllow=followerId.toString()
        await notificationRepository.saveNotification(folllow,user._id,'birthday');
      });
    });
  };

  cron.schedule('0 0 * * * *', () => {
    console.log('Running daily birthday check...');
    checkBirthdays();
  });
};
