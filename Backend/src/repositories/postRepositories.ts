import { Model } from 'mongoose';
import Post,{ PostDocument } from '../models/postModel';

export class PostRepository {
    private postUserModel: Model<PostDocument>;

    constructor() {
        this.postUserModel = Post;
    }

    async createPost(postData: Partial<PostDocument>): Promise<PostDocument | null> {
      try {
        const post = await this.postUserModel.create(postData);
        console.log("Post created:", post);
        return post;
      } catch (error) {
        console.error("Error creating post:", error);
        throw new Error('Failed to create post');
      }
    } 
    
    async getAllPosts() {
      try {
        const posts = await this.postUserModel.find();
        return posts;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch posts');
      }
    }
}



export default new PostRepository()