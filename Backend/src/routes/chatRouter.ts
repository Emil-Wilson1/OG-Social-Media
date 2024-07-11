import express, { Router } from 'express';

import { deleteMessageController, getActiveConversations, messages, saveActiveConversation, saveMessage } from '../controllers/chatController';
import { protect } from '../middlewares/authMiddleware';

const router:Router = express.Router();

router.post('/save', protect,saveMessage);
router.get('/messages/:userId/:receiverId', protect,messages);
router.delete('/message/:messageId',protect, deleteMessageController);
router.get('/active',protect, getActiveConversations);
router.post('/active',protect, saveActiveConversation);

export default router;