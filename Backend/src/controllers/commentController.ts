import userRepository  from './../repositories/userRepository';
import commentRepository from "../repositories/commentRepository";
import { Request, Response } from "express";
import postUserModel from "../models/postModel";
import commentModel from "../models/commentModel";

export const addComment = async (req: Request, res: Response) => {
  try {
    const { userId, postId, content } = req.body;

    // Create a new comment document
    const newComment = await commentRepository.addComment(userId, postId, content);

    // Find the post document and populate the comments field
    const post = await postUserModel.findById(postId).populate('comments');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Push the new comment's _id to the comments array
    post.comments.push(newComment._id);

    // Save the updated post document
    await post.save();

    // Log the post document with the populated comments
    console.log(post);

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};



export const getCommentsForPost = async (req: Request, res: Response) => {
  try {
    // Extract postId from request params
    const { postId } = req.params;

    // Fetch comments from the database for the specified postId
    const comments = await commentModel.find({ postId });

    // Send the comments as the response
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};



export const fetchUserDetailsForComments = async (req: Request, res: Response) => {
  try {
    const comments = req.body.comments;
    console.log("Comments:",comments);
    if (!Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({ message: 'Invalid or missing comments' });
    }

    // Fetch user details for all comments in parallel
    const userPromises = comments.map(comment => userRepository.findUserById(comment.userId));
    const users = await Promise.all(userPromises);

    // Map user details to comments
    comments.forEach((comment, index) => {
      const user = users[index];
      if (user) {
        comment.userName = user.username;
        comment.profilePic = user.profilePic;
      } else {
        console.warn(`User not found for userId: ${comment.userId}`);
      }
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Failed to fetch user details for comments:', error);
    res.status(500).json({ message: 'Failed to fetch user details for comments' });
  }
};


export const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId; // Assuming commentId is in request params
  
  try {
    await commentRepository.deleteComment(commentId);
    res.status(200).send('Comment deleted successfully');
  } catch (error) {
    res.status(500).send(`Failed to delete comment: ${error}`);
  }
};
