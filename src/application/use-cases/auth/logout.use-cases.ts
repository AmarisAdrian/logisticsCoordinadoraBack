import { UsuarioRepository } from '../../../core/ports/repositories/usuario.repository';
export class LogoutUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async execute(userId: number): Promise<void> {
    await this.usuarioRepository.incrementTokenVersion(userId);
  }
}