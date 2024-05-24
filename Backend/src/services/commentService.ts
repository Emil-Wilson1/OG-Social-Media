import postRepository,{ PostRepository } from './../repositories/postRepositories';
import { CommentDocument } from "../models/commentModel";
import commentRepository,{ CommentRepository } from '../repositories/commentRepository';
import userRepository,{ UserRepository } from '../repositories/userRepository';
import  {Comment}  from '../types/interfaces';


class commentService {

    constructor( private postRepository:PostRepository,
        private commentRepository:CommentRepository,
        private userRepository: UserRepository
    ) { }

    async addComment(userId: string, postId: string, content: string) {
        const newComment = await this.commentRepository.addComment(userId,postId,content)
        const post = await this.postRepository.findPostById(postId)
        if (!post) {
          throw new Error('Post not found');
        }
        post.comments.push(newComment._id);
        await post.save();
    
        return newComment;
      }


      async deleteComment(commentId: string): Promise<void> {
        await this.commentRepository.deleteComment(commentId);
      }


      async getCommentsForPost(postId: string): Promise<CommentDocument[]> {
        return await this.commentRepository.getCommentsForPost(postId);
      }


      async fetchUserDetailsForComments(comments: Comment[]): Promise<Comment[]> {
        if (!Array.isArray(comments) || comments.length === 0) {
          throw new Error('Invalid or missing comments');
        }
    
        const userPromises = comments.map(comment => this.userRepository.findUserById(comment.userId));
        const users = await Promise.all(userPromises);
    
        comments.forEach((comment, index) => {
          const user = users[index];
          if (user) {
            comment.userName = user.username;
            comment.profilePic = user.profilePic;
          } else {
            console.warn(`User not found for userId: ${comment.userId}`);
          }
        });
    
        return comments;
      }
}

export default new commentService(postRepository,commentRepository,userRepository)