
export interface Usuario {
  id_usuario?: number;
  nombre: string;
  email: string;
  password: string;
  tipo: 'cliente' | 'administrador' | 'transportista';
  fecha_registro?: Date;
  estado?: 'activo' | 'inactivo';
  tokenVersion?: number;
}

export interface UpdateUserDto {
  nombre?: string;
  email?: string;
  password?: string;
  tipo?: 'cliente' | 'administrador' | 'transportista';
  estado?: 'activo' | 'inactivo';
}

export interface UserProfileResponse {
  id: number;
  nombre: string;
  email: string;
  tipo: string;
  fecha_registro: Date;
}

export interface CreateUserDto {
  nombre: string;
  email: string;
  password: string;
  tipo: 'cliente' | 'administrador' | 'transportista';
}