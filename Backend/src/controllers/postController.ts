import { Request, Response } from "express";
import postService from "../services/postService";
import userService from "../services/userService";
import { ReportAttrs} from "../models/reportModel";
import { HttpStatusCode } from "../types/httpStatus";
import notificationRepository from "../repositories/notificationRepository";


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
//       userId: user._id,
//       description,
//       image,
//     });
  
//     res.status(HttpStatusCode.OK).json({ success: true, message: "Post uploaded successfully" });
//   } catch (error) {
//     console.error('Error creating post:', error);
//     res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to create post",
//       error: error
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
    let images: string[] = [];

    if (req.files) {
      // Assuming `req.files` is an array of files
      images = await Promise.all((req.files as Express.Multer.File[]).map(file => postService.uploadImage(file)));
    }

    await postService.createPost({
      userId: user._id,
      description,
      images,
    });
  
    res.status(HttpStatusCode.OK).json({ success: true, message: "Post uploaded successfully" });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create post",
      error: error,
    });
  }
};



export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { posts } = await postService.getAllPosts();
    console.log(posts,"is it ok?")
    res.status(HttpStatusCode.OK).json({ posts });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};




export const likePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    await postService.likePost(postId, userId);
    //await notificationRepository.saveNotification(postId,userId,'like')
    res.status(HttpStatusCode.OK).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};


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
}


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













