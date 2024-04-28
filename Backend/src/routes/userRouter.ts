

import express, { Router } from 'express';
import { signup, login, verifyOTP, fetchUserById,editProfile,forgotPassword,resetPassword} from '../controllers/userController';
import { upload } from '../utils/multer';


const router:Router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify', verifyOTP);
router.get('/profile', fetchUserById);
router.put('/editProfile',upload.single('profilePic'),editProfile)
router.post('/reset', forgotPassword);
router.post('/forgot', resetPassword);

export default router;