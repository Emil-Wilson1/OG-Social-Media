import jwt from 'jsonwebtoken';




interface JWTPayload {
  userId: string;
}

export class JWTUtil {
  generateAccessToken(userId: string): string {
    const payload: JWTPayload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }

  generateRefreshToken(userId: string): string { // Optional for refresh functionality
    const payload: JWTPayload = { userId };
    // Set a longer expiration for refresh token (e.g., 1 week)
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
  }
}
