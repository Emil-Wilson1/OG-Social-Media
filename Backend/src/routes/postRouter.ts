import { createPost, getAllPosts, likePost, unlikePost } from './../controllers/postController';
import express, { Router } from 'express';
import { upload } from '../utils/multer';


const router:Router = express.Router();

router.post('/posts',upload.single('image'),createPost);
router.get('/fetchPosts', getAllPosts);
router.put('/:postId/like',likePost);
router.delete('/:postId/unlike', unlikePost);


export default router;