import { addComment, deleteComment, fetchUserDetailsForComments, getCommentsForPost } from './../controllers/commentController';
import { createPost, deletePost,  fetchReportedUsers,  getAllPosts, likePost, reportPost, savedPost, unlikePost, unsavedPost, updatePostDescription } from './../controllers/postController';
import express, { Router } from 'express';
import { upload } from '../utils/multer';
import protect from '../middlewares/authMiddleware';


const router:Router = express.Router();

router.post('/posts',protect,upload.single('image'),createPost);
router.get('/fetchPosts',protect,getAllPosts);
router.put('/:postId/like',protect,likePost);
router.delete('/:postId/unlike',protect, unlikePost);
router.post('/addComments',protect,addComment)
router.get('/:postId/comments',protect, getCommentsForPost);
router.post('/fetchComments',protect, fetchUserDetailsForComments)
router.delete('/:commentId', protect, deleteComment);
router.put('/:postId/save', protect, savedPost);
router.delete('/:postId/unsave',protect,  unsavedPost);
router.post('/report',protect, reportPost)
router.delete('/postDeleted/:postId',protect, deletePost)
router.put('/updatePostDescription',protect, updatePostDescription)
router.get('/reportedUsers',protect, fetchReportedUsers)

export default router;