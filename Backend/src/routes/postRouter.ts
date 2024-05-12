import { addComment, deleteComment, fetchUserDetailsForComments, getCommentsForPost } from './../controllers/commentController';
import { createPost, getAllPosts, likePost, reportPost, savedPost, unlikePost, unsavedPost } from './../controllers/postController';
import express, { Router } from 'express';
import { upload } from '../utils/multer';


const router:Router = express.Router();

router.post('/posts',upload.single('image'),createPost);
router.get('/fetchPosts', getAllPosts);
router.put('/:postId/like',likePost);
router.delete('/:postId/unlike', unlikePost);
router.post('/addComments',addComment)
router.get('/:postId/comments', getCommentsForPost);
router.post('/fetchComments',fetchUserDetailsForComments)
router.delete('/:commentId', deleteComment);
router.put('/:postId/save', savedPost);
router.delete('/:postId/unsave', unsavedPost);
router.post('/report',reportPost)

export default router;