import { followUser, resendOTP, togglePrivacy, unfollowUser } from './../controllers/userController';


import express, { Router } from 'express';
import { signup, login, verifyOTP, fetchUserById,editProfile,forgotPassword,resetPassword} from '../controllers/userController';
import { upload } from '../utils/multer';
import protect, { refreshAccessToken } from '../middlewares/authMiddleware';
import { notifications } from '../controllers/notificationController';


const router:Router = express.Router();

router.post('/signup', signup);
router.post('/refresh-token', refreshAccessToken);
router.post('/login', login);
router.post('/verify', verifyOTP);
router.get('/profile',protect,fetchUserById);
router.put('/editProfile',protect, upload.single('profilePic'),editProfile)
router.post('/reset', forgotPassword);
router.post('/forgot', resetPassword);
router.post('/resend', resendOTP);
router.post('/follow/:userId', followUser);
router.post('/unfollow/:userId', unfollowUser);
router.get('/notifications/:userId',notifications);
router.put('/:userId/togglePrivacy', togglePrivacy);

export default router;