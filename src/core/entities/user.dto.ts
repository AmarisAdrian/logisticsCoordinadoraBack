
export type UsuarioTipo = 'cliente' | 'administrador' | 'transportista';
export type UsuarioEstado = 'activo' | 'inactivo';

export interface Usuario {
  id_usuario?: number;
  nombre: string;
  email: string;
  password: string;
  tipo: UsuarioTipo;
  fecha_registro?: Date;
  estado: UsuarioEstado;
  tokenVersion?: number;
}

export interface UpdateUserDto {
  nombre?: string;
  email?: string;
  password?: string;
  tipo?: UsuarioTipo;
  estado?: UsuarioEstado;
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
  tipo: UsuarioTipo;
  estado: UsuarioEstado;
  fecha_registro?: Date;
}
