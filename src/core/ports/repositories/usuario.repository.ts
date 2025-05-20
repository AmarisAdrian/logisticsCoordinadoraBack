import { Usuario } from '../../entities/usuario.entity';

export interface UsuarioRepository {
  findAll(): Promise<Usuario[]>;
  findByName(nombre: string): Promise<Usuario | null>;
  findByTipo(tipo: string): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  create(usuario: Omit<Usuario, 'id_usuario'>): Promise<Usuario>;
  update(id: number, usuario: Partial<Usuario>): Promise<Usuario>;
  findByEmailWithPassword(email: string): Promise<(Usuario & { password: string }) | null>;
  incrementTokenVersion(id: number): Promise<void>;
  findByIdWithTokenVersion(id: number): Promise<(Usuario & { tokenVersion: number }) | null>;
}