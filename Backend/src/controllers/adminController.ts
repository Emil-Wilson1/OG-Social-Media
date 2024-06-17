import { Request, Response } from 'express';
import authService from '../services/userService';
import adminService from '../services/adminService';
import { HttpStatusCode } from '../types/httpStatus';



export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await adminService.login(email, password);

    if (typeof result === 'string') {
      const token = result;
      const userId = await authService.getUserIdFromToken(token);
      console.log("token decode:", userId);
      res.status(HttpStatusCode.CREATED).json({ token, userId });
    } else if ('emailMatch' in result) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Email not found' });
    } else if ('passMatch' in result) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Incorrect password' });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Login failed' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Login failed' });
  }
};

export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await adminService.fetchAllUsers();
    res.status(HttpStatusCode.OK).json({ users });
  } catch (error) {
    console.error('Error fetching all users:', error);

    if (error instanceof Error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'An unknown error occurred' });
    }
  }
};



export const block = async (req: Request, res: Response) => {
  const userId = req.query.id as string; 

  if (!userId) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'User ID is required' });
  }

  try {
    await adminService.blockUser(userId);
    res.status(HttpStatusCode.OK).json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};


export const unblock = async (req: Request, res: Response) =>  {
  const userId = req.query.id as string; 
  if (!userId) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'User ID is required' });
  }
  try {
    await adminService.unblockUser(userId);
    res.status(HttpStatusCode.OK).json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

export const blockPost = async (req: Request, res: Response) => {
  const { postId, reportId } = req.params;

  try {
    await adminService.blockPost(postId, reportId);
    res.status(HttpStatusCode.OK).json({ message: 'Post blocked successfully.' });
  } catch (error) {
    console.error('Error blocking post:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while blocking the post.' });
  }
};


export const unblockPost = async (req: Request, res: Response) => {
  const { postId, reportId } = req.params;
  try {
    await adminService.unblockPost(postId, reportId);
    res.status(HttpStatusCode.OK).json({ message: 'Post unblocked successfully.' });
  } catch (error) {
    console.error('Error unblocking post:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while unblocking the post.' });
  }
};



