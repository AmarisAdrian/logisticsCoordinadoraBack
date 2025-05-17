import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../../core/ports/services/auth.service';
import { TokenPayload } from '../../../core/entities/token-payload.entity';

export class JwtAuthService implements AuthService {
  constructor(
    private readonly accessTokenSecret: jwt.Secret,
    private readonly refreshTokenSecret: jwt.Secret,
    private readonly accessTokenExpiresIn: any = '15m',
    private readonly refreshTokenExpiresIn: any = '7d'  
  ) {}

  generateToken(payload: TokenPayload): string {
    const options: jwt.SignOptions = {
      expiresIn: this.accessTokenExpiresIn
    };
    return jwt.sign(
      payload, 
      this.accessTokenSecret, 
      options
    );
  }

  generateRefreshToken(payload: TokenPayload): string {
    const options: jwt.SignOptions = {
      expiresIn: this.refreshTokenExpiresIn
    };
    return jwt.sign(
      { ...payload, isRefreshToken: true },
      this.refreshTokenSecret,
      options
    );
  }

  verifyToken(token: string, isRefreshToken = false): TokenPayload {
    const secret = isRefreshToken ? this.refreshTokenSecret : this.accessTokenSecret;
    const decoded = jwt.verify(token, secret) as TokenPayload;

    if (isRefreshToken && !decoded.isRefreshToken) {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}