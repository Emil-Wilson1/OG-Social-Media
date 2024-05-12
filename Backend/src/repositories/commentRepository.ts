import { Model } from "mongoose";
import Comment,{ CommentDocument } from "../models/commentModel";

export class CommentRepository {
    private commentModel: Model<CommentDocument>;

    constructor() {
        this.commentModel = Comment;
    }


    async findCommentById(postID: string): Promise<CommentDocument | null> {
        try {
          const commentId = await this.commentModel
            .findOne({ postId:postID })
            .exec()
          return commentId;
        } catch (error) {
          console.error(`Error fetching user by ID ${postID}:`, error);
          throw new Error('Failed to fetch user');
        }
      }



      
    async addComment(userId: string, postId: string, content: string): Promise<CommentDocument> {
      try {
          const newComment = await this.commentModel.create({
              userId,
              postId,
              content
          });
          return newComment;
      } catch (error) {
          throw new Error(`Failed to add comment: ${error}`);
      }
  }


  async deleteComment(commentId: string): Promise<void> {
    try {
      await this.commentModel.deleteOne({ _id: commentId });
    } catch (error) {
      throw new Error(`Failed to delete comment: ${error}`);
    }
  }
}


export default new CommentRepository()