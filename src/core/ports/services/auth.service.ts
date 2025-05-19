export interface AuthService {
  generateToken(payload: { id: number; email: string; tipo: string }): string;
  verifyToken(token: string): { id: number; email: string; tipo: string };
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateRefreshToken(payload: TokenPayload): string;
}


export interface TokenPayload {
  id: number;
  email: string;
  tipo: string;
  tokenVersion?: number;
  isRefreshToken?: boolean; 
}