import jwt from 'jsonwebtoken';
import {User, UserDocument}  from '../models/userModel.js';
import userRepository from '../repositories/userRepository';
import { Request, Response, NextFunction } from 'express';

const verifyUser = async (decodedToken: { userId: string }): Promise<UserDocument | null> => {
    try {
      const userQuery = userRepository.findUserById(decodedToken.userId)
      const user = await userQuery;
      return user;
    } catch (err) {
      throw err;
    }
  };


const renewAccessToken = async (userId: string): Promise<string> => {
    const token = await new Promise<string | undefined>((resolve, reject) => {
      jwt.sign({ userId }, "your_secret_key_here", { expiresIn: '1hr' }, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  
    if (!token) {
      throw new Error('Failed to generate access token');
    }
  
    return token as string;
  };


  const protect = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      console.log("Access Token:", token);
  
      try {
        const decoded: any = jwt.verify(token, "your_secret_key_here");
        const user = await verifyUser(decoded); 
  
        if (user) {
          if (!user.blocked) {
            console.log("Successfully protected");
            next();
          } else {
            res.status(403).json({
              message: 'User has been blocked',
              status: 403,
              error_code: 'FORBIDDEN',
            });
          }
        } else {
          res.status(404).json({
            message: 'User not found',
            status: 404,
            error_code: 'NOT_FOUND',
          });
        }
      } catch (error) {
        console.error("JWT verification error:", error);
  
        let message = 'User not authorized';
        let errorCode = 'AUTHENTICATION_FAILED';
  
        if (error === 'TokenExpiredError') {
          message = 'Token has expired';
          errorCode = 'TOKEN_EXPIRED';
        } else if (error=== 'JsonWebTokenError') {
          message = 'Invalid token';
          errorCode = 'INVALID_TOKEN';
        }
  
        res.status(401).json({
          message,
          status: 401,
          error_code: errorCode,
        });
      }
    } else {
      res.status(401).json({
        status: 401,
        message: 'No token provided',
        error_code: 'NO_TOKEN',
        noRefresh: true,
      });
    }
  };


  export const refreshAccessToken = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const refreshTokenHeader = req.headers['x-refresh-token'];
  
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const accessToken = authHeader.split(' ')[1];
        let refreshToken: string | undefined;
  
        if (Array.isArray(refreshTokenHeader)) {
          refreshToken = refreshTokenHeader[0];
        } else if (typeof refreshTokenHeader === 'string') {
          refreshToken = refreshTokenHeader;
        }
  
        if (refreshToken) {
          console.log('Received refresh token:', refreshToken);
          const decodedRefreshToken: any = jwt.verify(refreshToken, process.env.JWT_SECRET || 'your_secret_key_here');
          console.log('Decoded refresh token:', decodedRefreshToken);
  
          const user = await verifyUser(decodedRefreshToken);
          if (user && !user.blocked) {
            const newAccessToken = await renewAccessToken(decodedRefreshToken.userId);
            console.log('Generated new access token:', newAccessToken);
            res.status(200).send({ newToken: newAccessToken });
          } else {
            console.warn('User not authorized or blocked');
            res.status(401).json({
              message: 'User not authorized',
              status: 401,
              error_code: 'AUTHENTICATION_FAILED',
            });
          }
        } else {
          console.warn('No refresh token provided');
          res.status(401).json({
            status: 401,
            message: 'No refresh token provided',
            error_code: 'NO_REFRESH_TOKEN',
          });
        }
      } else {
        console.warn('No token provided');
        res.status(401).json({
          status: 401,
          message: 'No token provided',
          error_code: 'NO_TOKEN',
        });
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      res.status(401).json({
        message: 'User not authorized',
        status: 401,
        error_code: 'AUTHENTICATION_FAILED',
        error,
      });
    }
  };
export default protect;