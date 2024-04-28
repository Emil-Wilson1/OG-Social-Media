import jwt from 'jsonwebtoken';




interface JWTPayload {
  userId: string;
}

export class JWTUtil {
  static generateAccessToken(userId: string): string {
    const secretKey = process.env.JWT_KEY_SECRET || 'default_secret'; // Fallback to a default secret key if environment variable is not set
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
    return token;
  }
  generateRefreshToken(userId: string): string { // Optional for refresh functionality
    const payload: JWTPayload = { userId };
    // Set a longer expiration for refresh token (e.g., 1 week)
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
  }
}

export default  JWTUtil
