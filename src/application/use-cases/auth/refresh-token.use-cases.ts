import { UsuarioRepository } from '../../../core/ports/repositories/usuario.repository';
import { AuthService } from '../../../core/ports/services/auth.service';
import { AuthResponse } from '../../../core/entities/auth.dto';
import { TokenPayload } from '../../../core/entities/token-payload.entity';
export class RefreshTokenUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly authService: AuthService
  ) {}

  async execute(refreshToken: string): Promise<AuthResponse> {
    const decoded = this.authService.verifyToken(refreshToken) as TokenPayload;
    
    if (!decoded.tokenVersion) {
      throw new Error('Token inválido: falta tokenVersion');
    }

    const user = await this.usuarioRepository.findByIdWithTokenVersion(decoded.id);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      throw new Error('Token inválido: versión incorrecta');
    }

    const newPayload: TokenPayload = {
      id: user.id_usuario,
      email: user.email,
      tipo: user.tipo,
      tokenVersion: user.tokenVersion
    };

    return {
      token: this.authService.generateToken(newPayload),
      refreshToken: this.authService.generateRefreshToken({
        ...newPayload,
        isRefreshToken: true
      }),
      usuario: {
        id: user.id_usuario,
        email: user.email,
        nombre: user.nombre,
        tipo: user.tipo
      }
    };
  }
}