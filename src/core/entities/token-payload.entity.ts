export interface TokenPayload {
  id: number;
  email: string;
  tipo: string;
  tokenVersion?: number;
  isRefreshToken?: boolean; 
}