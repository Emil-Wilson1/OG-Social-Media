import mongoose, { Model } from 'mongoose';
import Post,{ PostDocument } from '../models/postModel';
import report,{ ReportAttrs, ReportDoc } from '../models/reportModel';

interface ReportResponse {
  status: number;
  error_code?: string;
  message: string;
  data?: any;
}
export class PostRepository {
    private postUserModel: Model<PostDocument>;
    
    private reportUserModel:Model<ReportDoc>;

    constructor() {
        this.postUserModel = Post;
        this.reportUserModel=report
    }

    async findPostById(postId: string): Promise<any> {
      return await this.postUserModel.findById(postId).populate('comments');
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
        const posts = await this.postUserModel.find({adminBlock:false});
        return posts;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch posts');
      }
    }




    async deletePostById(postId: string): Promise<void> {
      try {
        console.log("entered in deletePost repository:",postId);
        await this.postUserModel.deleteOne({_id:postId});
      } catch (error) {
        throw new Error(`Failed to delete post: ${error}`);
      }
     
    }
    async editPostDescription(postId: string, newDescription: string): Promise<PostDocument | null> {
      try {
        const updatedPost = await this.postUserModel.findByIdAndUpdate(postId, { description: newDescription }, { new: true });
        return updatedPost;
      } catch (error) {
        console.error("Error editing post description:", error);
        throw new Error("Failed to edit post description");
      }
    }
    async getReportedUsers(): Promise<ReportAttrs[]> {
      try {
          const users = await this.reportUserModel.find().exec();
          return users; 
      } catch (error) {
          console.error('Error fetching reported users:', error);
          throw error; 
      }
  }
}

export default new PostRepository()