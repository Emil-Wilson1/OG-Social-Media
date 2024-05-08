
import { Request, Response } from "express";
import postService from "../services/postService";
import postRepository from "../repositories/postRepositories";
import userService from "../services/userService";
import userRepository from "../repositories/userRepository";
import postUserModel from "../models/postModel";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user: {
    _id: string; // Assuming 'user' has an '_id' property
    // Add other properties of the 'user' object as needed
  };
}


export const createPost = async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string | undefined;
    if (!id) {
      throw new Error("User ID is missing in the query parameters");
    }
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const { description } = req.body;
    let image = "";
    if (req.file) {
      image = await postService.uploadImage(req.file);
    }

    await postRepository.createPost({
      userId:user._id,
      description,
      image,
    });

    res.json({ success: true, message: "Post uploaded successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
      error: error,
    });
  }
};



export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const postsData = await postRepository.getAllPosts();
    const postsWithUser = [];
    for (const post of postsData) {
      const userIdString = post.userId.toString(); 
      const userData = await userRepository.findUserById(userIdString);
      if (userData) {
        const postDataWithUser = {
          ...post.toObject(), // Convert post Mongoose document to plain object
          user: userData.username,
          proImg:userData.profilePic // Assuming `username` is the property for the username in the user data
        };
        postsWithUser.push(postDataWithUser);
      }
    }
    console.log(postsWithUser);
    
    res.status(200).json({ posts: postsWithUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const likePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await postUserModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    // Add user ID to likes array
    post.likes.push(userId);
    await post.save();

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const unlikePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await postUserModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    const likedIndex = post.likes.indexOf(userId);
    if (likedIndex === -1) {
      return res.status(400).json({ message: 'Post is not liked by the user' });
    }

    // Remove user ID from likes array
    post.likes.splice(likedIndex, 1);
    await post.save();

    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// // Define your route handler function
// export const toggleLike = async (req: Request, res: Response) => {
//   try {
//     const { postId } = req.body;
//     const userId = (req as any).user._id; // Assert req to any and access the user property

//     const updatedPost = await postService.likePost(postId, userId);
//     res.status(200).json(updatedPost);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error: error });
//   }
// };





