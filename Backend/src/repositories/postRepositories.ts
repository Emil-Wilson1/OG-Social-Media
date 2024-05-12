import { Model } from 'mongoose';
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




    async createReport(reportData: ReportDoc): Promise<ReportResponse> {
      try {
          const newReport = new this.reportUserModel(reportData);
          const response = await newReport.save();
          return {
              status: 200,
              message: "Report created successfully",
              data: response
          };
      } catch (error) {
          return {
              status: 500,
              error_code: "DB_FETCH_ERROR",
              message: "Error saving to DB",
              data: error
          };
      }
  }
}





export default new PostRepository()