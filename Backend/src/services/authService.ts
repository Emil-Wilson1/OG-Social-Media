// services/tokenService.ts
import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/userModel';
import userRepository from '../repositories/userRepository';

class TokenService {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'your_secret_key_here';
  }

  async verifyUser(decodedToken: { userId: string }): Promise<UserDocument | null> {
    try {
      const userQuery = userRepository.findUserById(decodedToken.userId);
      const user = await userQuery;
      return user;
    } catch (err) {
      throw err;
    }
  }

  async renewAccessToken(userId: string): Promise<string> {
    const token = await new Promise<string | undefined>((resolve, reject) => {
      jwt.sign({ userId }, this.secretKey, { expiresIn: '1h' }, (err, token) => {
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
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.secretKey);
  }
}

export default new TokenService();
