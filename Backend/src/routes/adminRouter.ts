import express, { Router } from 'express';
import { block, blockPost, fetchAllUsers, login, unblock, unblockPost } from '../controllers/adminController';
import { fetchReportedUsers } from '../controllers/postController';


const router:Router = express.Router();


router.post('/login', login);
router.get('/fetchUsers', fetchAllUsers);
router.put('/block', block);
router.put('/unblock', unblock);
router.post('/blockPost/:postId/:reportId', blockPost);
router.post('/unblockPost/:postId/:reportId', unblockPost);
// router.get('/reportedUsers',fetchReportedUsers)
export default router;