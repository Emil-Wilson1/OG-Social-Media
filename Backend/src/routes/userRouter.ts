

import express, { Router } from 'express';
import { signup, login, verifyOTP, fetchUserById,editProfile } from '../controllers/userController';
import { upload } from '../utils/multer';


const router:Router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify', verifyOTP);
router.get('/profile', fetchUserById);
router.put('/editProfile',upload.single('profilePic'),editProfile)

export default router;