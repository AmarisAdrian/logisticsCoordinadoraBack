export interface Usuario {
  id_usuario?: number;
  nombre: string;
  email: string;
  password: string;
  tipo: 'cliente' | 'administrador' | 'transportista';
  fecha_registro?: Date;
  estado?: 'activo' | 'inactivo';
}