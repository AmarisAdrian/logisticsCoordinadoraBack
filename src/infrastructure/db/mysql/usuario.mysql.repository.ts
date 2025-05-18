import { MySQLRepository } from './mysql.repository';
import { UsuarioRepository } from '../../../core/ports/repositories/usuario.repository';
import { Usuario } from '../../../core/entities/usuario.entity';

export class UsuarioMySQLRepository extends MySQLRepository implements UsuarioRepository {

  constructor() {
    super();
  }
  async findAll(): Promise<Usuario[]> {
    const sql = 'SELECT * FROM usuario';
    return this.query<Usuario[]>(sql);
  }

  async findByEmailWithPassword(email: string): Promise<(Usuario & { password: string }) | null> {
    const sql = 'SELECT * FROM usuario WHERE email = ?';
    const [usuario] = await this.query<(Usuario & { password: string })[]>(sql, [email]);
    return usuario || null;
  }

  async findById(id: number): Promise<Usuario | null> {
    const sql = 'SELECT * FROM usuario WHERE id_usuario = ?';
    const [usuario] = await this.query<Usuario[]>(sql, [id]);
    return usuario || null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const sql = 'SELECT * FROM usuario WHERE email = ?';
    const [usuario] = await this.query<Usuario[]>(sql, [email]);
    return usuario || null;
  }

  async create(usuario: Omit<Usuario, 'id_usuario'>): Promise<Usuario> {
    const sql = 'INSERT INTO usuario SET ?';
    const result = await this.execute(sql, [usuario]);
    return { ...usuario, id_usuario: result.insertId };
  }

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    const sql = 'UPDATE usuario SET ? WHERE id_usuario = ?';
    await this.execute(sql, [usuario, id]);
    return this.findById(id) as Promise<Usuario>;
  }
   async incrementTokenVersion(id: number): Promise<void> {
    await this.execute('UPDATE usuario SET tokenVersion = tokenVersion + 1 WHERE id_usuario = ?', [id]);
  }

  async findByIdWithTokenVersion(id: number): Promise<(Usuario & { tokenVersion: number }) | null> {
    const [user] = await this.query<(Usuario & { tokenVersion: number })[]>(
      'SELECT id_usuario, email, tipo, tokenVersion FROM usuario WHERE id_usuario = ?', 
      [id]
    );
    return user || null;
  }

}