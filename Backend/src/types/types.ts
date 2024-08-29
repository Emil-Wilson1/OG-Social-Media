import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        // Add any other properties that might be in your user object
      };
    }
  }
}