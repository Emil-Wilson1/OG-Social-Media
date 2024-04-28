
import { Request, Response } from 'express';
import authService from '../services/userService';
import adminService from '../services/adminService';
import adminRepository from '../repositories/adminRepository';



export const login = async (req: Request, res: Response) => {
  const {email, password } = req.body;

  try {
    const result= await adminService.login(email, password);

    if (typeof result === 'string') {
      const token = result;
      const userId = await authService.getUserIdFromToken(token);
      console.log("token decode:",userId);
      
      res.status(201).json({ token,userId }); // Return token if authentication is successful
    } else if ('emailMatch' in result) {
      res.status(401).json({ message: 'Email not found' }); // Return email not found error
    } else if ('passMatch' in result) {
      res.status(401).json({ message: 'Incorrect password' }); // Return incorrect password error
    } else {
      res.status(500).json({ message: 'Login failed' }); // Fallback for generic error
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};



export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const userDatas = await adminRepository.getAllUsers();
    res.status(200).json({ users: userDatas });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};


export const block = async (req: Request, res: Response) =>  {
  const userId = req.query.id as string; // Assuming userId is the query parameter name
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    await adminRepository.blockUser(userId);
    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const unblock = async (req: Request, res: Response) =>  {
  const userId = req.query.id as string; // Assuming userId is the query parameter name
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    await adminRepository.unblockUser(userId);
    res.status(200).json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


