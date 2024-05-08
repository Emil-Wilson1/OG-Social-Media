
import cloudinary from 'cloudinary';
import Post,{ PostDocument } from '../models/postModel';
import mongoose, { Model } from 'mongoose';
class postService {

  private postUserModel: Model<PostDocument>;

  constructor() {
      this.postUserModel = Post;
  }
    async uploadImage(file: Express.Multer.File): Promise<string> {
        try {
          const result = await cloudinary.v2.uploader.upload(file.path);
          console.log("cloudinary image:",result);
          return result.secure_url;
        } catch (error) {
          throw new Error('Error uploading image to Cloudinary');
        }
      }



async  likePost(postId: string, userId: string) {
  try {
    const post = await this.postUserModel.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (post.likes.some((likeId) => likeId.toString() === userObjectId.toString())) {
      post.likes = post.likes.filter((likeId) => likeId.toString() !== userObjectId.toString());
    } else {
      post.likes.push(userObjectId);
      }

      return await post.save();
    } catch (error) {
    throw new Error('Eroor');
  }

}

}

export default new postService()