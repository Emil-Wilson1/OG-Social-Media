import { Request, Response } from "express";
import postService from "../services/postService";
import postRepository from "../repositories/postRepositories";
import userService from "../services/userService";
import userRepository from "../repositories/userRepository";
import postUserModel from "../models/postModel";
import reportUserModel, { ReportAttrs, ReportDoc } from "../models/reportModel";
import { HttpStatusCode } from "../types/httpStatus";


// interface AuthenticatedRequest extends Request {
//   user: {
//     _id: string; // Assuming 'user' has an '_id' property
//     // Add other properties of the 'user' object as needed
//   };
// }


// export const createPost = async (req: Request, res: Response) => {
//   try {
//     const id = req.query.id as string | undefined;
//     if (!id) {
//       throw new Error("User ID is missing in the query parameters");
//     }
//     const user = await userService.fetchUserById(id);
//     if (!user) {
//       throw new Error("User not found");
//     }
//     const { description } = req.body;
//     let image = "";
//     if (req.file) {
//       image = await postService.uploadImage(req.file);
//     }

//     await postService.createPost({
//       userId:user._id,
//       description,
//       image,
//     });

//     res.json({ success: true, message: "Post uploaded successfully" });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update user profile",
//       error: error,
//     });
//   }
// };

export const createPost = async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string | undefined;
    if (!id) {
      throw new Error("User ID is missing in the query parameters");
    }
    const user = await userService.fetchUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const { description } = req.body;
    let image = "";
    if (req.file) {
      image = await postService.uploadImage(req.file);
    }

    await postService.createPost({
      userId: user._id,
      description,
      image,
    });
  
    res.status(HttpStatusCode.OK).json({ success: true, message: "Post uploaded successfully" });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create post",
      error: error
    });
  }
};

// export const getAllPosts = async (req: Request, res: Response) => {
//   try {
//     const postsData = await postRepository.getAllPosts();
//     const postsWithUser = [];
//     for (const post of postsData) {
//       const userIdString = post.userId.toString(); 
//       const userData = await userRepository.findUserById(userIdString);
//       if (userData) {
//         const postDataWithUser = {
//           ...post.toObject(),
//           user: userData.username,
//           proImg:userData.profilePic 
//         };
//         postsWithUser.push(postDataWithUser);
//       }
//     }
//     console.log(postsWithUser);
    
//     res.status(200).json({ posts: postsWithUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { posts } = await postService.getAllPosts();
    res.status(HttpStatusCode.OK).json({ posts });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};


// export const likePost = async (req: Request, res: Response) => {
//   const { postId } = req.params;
//   const { userId } = req.body;

//   try {
//     const post = await postUserModel.findById(postId);

//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     // Check if the user already liked the post
//     if (post.likes.includes(userId)) {
//       return res.status(400).json({ message: 'Post already liked' });
//     }


//     post.likes.push(userId);
//     await post.save();

//     res.status(200).json({ message: 'Post liked successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const likePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    await postService.likePost(postId, userId);
    res.status(HttpStatusCode.OK).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

// export const unlikePost = async (req: Request, res: Response) => {
//   const { postId } = req.params;
//   const { userId } = req.body;

//   try {
//     const post = await postUserModel.findById(postId);

//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     const likedIndex = post.likes.indexOf(userId);
//     if (likedIndex === -1) {
//       return res.status(400).json({ message: 'Post is not liked by the user' });
//     }


//     post.likes.splice(likedIndex, 1);
//     await post.save();

//     res.status(200).json({ message: 'Post unliked successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const unlikePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    await postService.unlikePost(postId, userId);
    res.status(HttpStatusCode.OK).json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      if (error.message === 'Post not found') {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: error.message });
      } else if (error.message === 'Post is not liked by the user') {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'An unknown error occurred' });
    }
  }
};



// export const savedPost = async (req: Request, res: Response) => {
//   const { postId } = req.params;
//   const { userId } = req.body;

//   try {
//     const post = await postUserModel.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
//     if (!post.saved.includes(userId)) {
//       post.saved.push(userId);
//       await post.save();
//     }
//     res.status(200).json({ message: 'Post saved successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to save post: ' + error});
//   }
// };


export const savedPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    await postService.savePost(postId, userId);
    res.status(HttpStatusCode.OK).json({ message: 'Post saved successfully' });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === 'Post not found') {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to save post: ' + error.message });
      }
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'An unknown error occurred' });
    }
  }
};

// export const unsavedPost = async (req: Request, res: Response) =>{
//   const { postId } = req.params;
//   const { userId } = req.body;
//   try {
//     const post = await postUserModel.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
//     const index = post.saved.indexOf(userId);
//     if (index === -1) {
//       return res.status(400).json({ message: 'Post is not liked by the user' });
//     }
//     post.saved.splice(index, 1);
//     await post.save();

//     res.status(200).json({ message: 'Post unliked successfully' });
//   } catch (error) {
//     throw new Error("Failed to unsave post: " + error);
//   }
// }


export const unsavedPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    await postService.unsavePost(postId, userId);
    res.status(HttpStatusCode.OK).json({ message: 'Post unsaved successfully' });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === 'Post not found') {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: error.message });
      } else if (error.message === 'Post is not saved by the user') {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to unsave post: ' + error.message });
      }
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'An unknown error occurred' });
    }
  }
};


// export const reportPost= async (req: Request, res: Response) => {
//   try {
//     const reportData: ReportAttrs = {
//       reporterId: req.body.reporterId,
//       reporterUsername: req.body.reporterUsername,
//       reportType: req.body.reportType,
//       targetId: req.body.targetId,
//       details: req.body.details,
//     };

//     const newReport = new reportUserModel(reportData);
//     const savedReport = await newReport.save();
//     res.status(201).json(savedReport);
//   } catch (err) {
//     res.status(400).json({ error:err});
//   }
// };


export const reportPost = async (req: Request, res: Response) => {
  try {
    const reportData: ReportAttrs = {
      reporterId: req.body.reporterId,
      reporterUsername: req.body.reporterUsername,
      reportType: req.body.reportType,
      targetId: req.body.targetId,
      details: req.body.details,
    };

    const savedReport = await postService.reportPost(reportData);
    res.status(HttpStatusCode.CREATED).json(savedReport);
  } catch (error) {
    console.error('Error reporting post:', error);

    if (error instanceof Error) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'An unknown error occurred' });
    }
  }
};


// export const deletePost = async (req: Request, res: Response) => {
//   const postId  = req.params.postId;
//   // if (!postId) {
//   //   throw new Error("User ID is missing in the query parameters");
//   // }
//   console.log(postId);
//   try {
//     await postRepository.deletePostById(postId);
//     res.status(204).send('Post Deleted Successfully');
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     res.status(500).send(`Failed to delete post: ${error}`);
//   }
// };


export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.postId;

  try {
    await postService.deletePostById(postId);
    res.status(HttpStatusCode.NO_CONTENT).send('Post Deleted Successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    
    if (error instanceof Error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(`Failed to delete post: ${error.message}`);
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send('An unknown error occurred');
    }
  }
};


// export const updatePostDescription = async (req: Request, res: Response) => {
//   const { postId, newDescription } = req.body;

//   try {
//     const updatedPost = await postRepository.editPostDescription(postId, newDescription);
//     if (updatedPost) {
//       res.status(200).json({ message: "Post description updated successfully", post: updatedPost });
//     } else {
//       res.status(404).json({ message: "Post not found" });
//     }
//   } catch (error) {
//     console.error("Error updating post description:", error);
//     res.status(500).json({ message: "Failed to update post description" });
//   }
// };



export const updatePostDescription = async (req: Request, res: Response) => {
  const { postId, newDescription } = req.body;

  try {
    const updatedPost = await postService.updatePostDescription(postId, newDescription);
    if (updatedPost) {
      res.status(HttpStatusCode.OK).json({ message: "Post description updated successfully", post: updatedPost });
    } else {
      res.status(HttpStatusCode.NOT_FOUND).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error updating post description:", error);

    if (error instanceof Error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to update post description", error: error.message });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "An unknown error occurred" });
    }
  }
};



// export const fetchReportedUsers = async (req: Request, res: Response) => {
//   try {
//     const user = await postRepository.getReportedUsers();
//     res.status(200).json({ users: user });
//   } catch (error) {
//     console.log(error);
//     res.json({ error });
//   }
// };



export const fetchReportedUsers = async (req: Request, res: Response) => {
  try {
    const users = await postService.fetchReportedUsers();
    res.status(HttpStatusCode.OK).json({ users });
  } catch (error) {
    console.error('Error fetching reported users:', error);

    if (error instanceof Error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch reported users", error: error.message });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "An unknown error occurred" });
    }
  }
};













