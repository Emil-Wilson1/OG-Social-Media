import { Request, Response } from 'express';
import authService from '../services/userService';

export const signup = async (req: Request, res: Response) => {
  const { fullname,email, username, password } = req.body; // Destructure email, username, phone, password from request body

  try {
    const token = await authService.signup(fullname,email, username,password); // Call authService.signup with all required parameters
    res.status(200).json({ token }); // Send token as JSON response
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const token = await authService.login(username, password);

    if (!token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};