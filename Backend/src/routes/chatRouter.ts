import express, { Router } from 'express';

import { messages, saveMessage } from '../controllers/chatController';
import { protect } from '../middlewares/authMiddleware';

const router:Router = express.Router();

router.post('/save', protect,saveMessage);
router.get('/messages/:userId/:receiverId', protect,messages);

export default router;