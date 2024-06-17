import { Request, Response } from "express";
import { HttpStatusCode } from '../types/httpStatus';
import CommentService from "../services/commentService";


export const addComment = async (req: Request, res: Response) => {
  try {
    const { userId, postId, content } = req.body;
    const newComment = await CommentService.addComment(userId, postId, content);
    res.status(HttpStatusCode.CREATED).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    if (error instanceof Error) {
      if (error.message === 'Post not found') {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to add comment' });
      }
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to add comment' });
    }
  }
};

export const getCommentsForPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await CommentService.getCommentsForPost(postId);
    res.status(HttpStatusCode.OK).json({ comments });
  } catch (error) {
    console.error('Failed to fetch comments:', error);

    if (error instanceof Error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch comments' });
    }
  }
};

export const fetchUserDetailsForComments = async (req: Request, res: Response) => {
  try {
    const comments = req.body.comments;
    console.log("Comments:", comments);

    const updatedComments = await CommentService.fetchUserDetailsForComments(comments);

    res.status(HttpStatusCode.OK).json(updatedComments);
  } catch (error) {
    console.error('Failed to fetch user details for comments:', error);

    if (error instanceof Error) {
      if (error.message === 'Invalid or missing comments') {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch user details for comments' });
    }
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  try {
    await CommentService.deleteComment(commentId);
    res.status(HttpStatusCode.OK).send('Comment deleted successfully');
  } catch (error) {
    console.error('Error deleting comment:', error);

    if (error instanceof Error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(`Failed to delete comment: ${error.message}`);
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send('Failed to delete comment');
    }
  }
};
