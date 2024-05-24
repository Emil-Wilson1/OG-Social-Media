import { Request, Response } from "express";
import { HttpStatusCode } from '../types/httpStatus';
import CommentService from "../services/commentService"

// export const addComment = async (req: Request, res: Response) => {
//   try {
//     const { userId, postId, content } = req.body;
//     const newComment = await commentRepository.addComment(userId, postId, content);

//     const post = await postUserModel.findById(postId).populate('comments');

//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }


//     post.comments.push(newComment._id);

//     await post.save();


//     console.log(post);

//     res.status(201).json(newComment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to add comment' });
//   }
// };


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



// export const getCommentsForPost = async (req: Request, res: Response) => {
//   try {

//     const { postId } = req.params;
//     const comments = await commentModel.find({ postId });
//     res.status(200).json({ comments });
//   } catch (error) {
//     console.error('Failed to fetch comments:', error);
//     res.status(500).json({ message: 'Failed to fetch comments' });
//   }
// };



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

// export const fetchUserDetailsForComments = async (req: Request, res: Response) => {
//   try {
//     const comments = req.body.comments;
//     console.log("Comments:",comments);
//     if (!Array.isArray(comments) || comments.length === 0) {
//       return res.status(400).json({ message: 'Invalid or missing comments' });
//     }
//     const userPromises = comments.map(comment => userRepository.findUserById(comment.userId));
//     const users = await Promise.all(userPromises);

//     comments.forEach((comment, index) => {
//       const user = users[index];
//       if (user) {
//         comment.userName = user.username;
//         comment.profilePic = user.profilePic;
//       } else {
//         console.warn(`User not found for userId: ${comment.userId}`);
//       }
//     });

//     res.status(200).json(comments);
//   } catch (error) {
//     console.error('Failed to fetch user details for comments:', error);
//     res.status(500).json({ message: 'Failed to fetch user details for comments' });
//   }
// };


// export const deleteComment = async (req: Request, res: Response) => {
//   const commentId = req.params.commentId; 
  
//   try {
//     await commentRepository.deleteComment(commentId);
//     res.status(200).send('Comment deleted successfully');
//   } catch (error) {
//     res.status(500).send(`Failed to delete comment: ${error}`);
//   }
// };


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
