import express, { Router } from 'express';
import { block, fetchAllUsers, login, unblock } from '../controllers/adminController';


const router:Router = express.Router();


router.post('/login', login);
router.get('/fetchUsers', fetchAllUsers);
router.put('/block', block);
router.put('/unblock', unblock);

export default router;