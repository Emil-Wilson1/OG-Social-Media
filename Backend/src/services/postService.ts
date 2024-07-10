import cloudinary from "cloudinary";
import Post, { PostDocument } from "../models/postModel";
import mongoose, { Model } from "mongoose";
import postRepository,{ PostRepository } from "../repositories/postRepositories";
import userRepository from "../repositories/userRepository";
import reportUserModel, { ReportAttrs } from "../models/reportModel";
class postService {
  private postUserModel: Model<PostDocument>;

  constructor(private postRepository:PostRepository) {
    this.postUserModel = Post;
  }
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const result = await cloudinary.v2.uploader.upload(file.path);
      console.log("cloudinary image:", result);
      console.log("url of Image",result.secure_url);
      
      return result.secure_url;
    } catch (error) {
      throw new Error("Error uploading image to Cloudinary");
    }
  }

  async createPost(postData: {
    userId: string;
    description: string;
    images: string[];
  }) {
    const newPost = new this.postUserModel(postData);
    await newPost.save();
    return newPost;
  }


  async getAllPosts(): Promise<{ posts: any[] }> {
    const postsData = await this.postRepository.getAllPosts();
    const postsWithUser = [];
    for (const post of postsData) {
      const userIdString = post.userId.toString()
      const userData = await userRepository.findUserById(userIdString);
      if (userData) {
        const postDataWithUser = {
          ...post.toObject(),
          user: userData.username,
          proImg: userData.profilePic 
        };
        postsWithUser.push(postDataWithUser);
      }
    }
    return { posts: postsWithUser };
  }


  async likePost(postId: string, userId: string): Promise<void> {
    try {
      const post = await this.postRepository.findPostById(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      // Check if the user already liked the post
      if (post.likes.includes(userId)) {
        throw new Error('Post already liked');
      }

      post.likes.push(userId);
      await post.save();
    } catch (error) {
      throw error; // Rethrow the error
    }
  }


  async unlikePost(postId: string, userId: string): Promise<void> {
    try {
      const post = await this.postRepository.findPostById(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      const likedIndex = post.likes.indexOf(userId);
      if (likedIndex === -1) {
        throw new Error('Post is not liked by the user');
      }

      post.likes.splice(likedIndex, 1);
      await post.save();
    } catch (error) {
      throw error; 
    }
  }


  async savePost(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findPostById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    if (!post.saved.includes(userId)) {
      post.saved.push(userId);
      await post.save();
    }
  }



  async unsavePost(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findPostById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    const index = post.saved.indexOf(userId);
    if (index === -1) {
      throw new Error('Post is not saved by the user');
    }
    post.saved.splice(index, 1);
    await post.save();
  }

  async reportPost(reportData: ReportAttrs): Promise<any> {
    const newReport = new reportUserModel(reportData);
    return await newReport.save();
  }

  async deletePostById(postId: string): Promise<void> {
    await postRepository.deletePostById(postId);
  }


  async updatePostDescription(postId: string, newDescription: string) {
    const updatedPost = await postRepository.editPostDescription(postId, newDescription);
    return updatedPost;
  }

  async fetchReportedUsers() {
    const reportedUsers = await postRepository.getReportedUsers();
    return reportedUsers;
  }
}

export default new postService(postRepository);