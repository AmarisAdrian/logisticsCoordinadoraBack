
export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  usuario: {
    id: number;
    email: string;
    nombre: string;
    tipo: string;
  };
}