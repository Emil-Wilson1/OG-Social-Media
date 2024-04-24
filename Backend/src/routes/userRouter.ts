
import express, { Router } from 'express';
import { signup, login, verifyOTP } from '../controllers/userController';


const router:Router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify', verifyOTP);

export default router;