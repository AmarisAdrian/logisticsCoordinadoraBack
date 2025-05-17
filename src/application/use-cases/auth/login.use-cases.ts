// src/application/use-cases/auth/login.use-case.ts
import { UsuarioRepository } from '../../../core/ports/repositories/usuario.repository';
import { AuthService } from '../../../core/ports/services/auth.service';
import { LoginDto, AuthResponse } from '../../../core/entities/auth.dto';

export class LoginUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly authService: AuthService
  ) {}

  async execute(credentials: LoginDto): Promise<AuthResponse> {
    const usuario = await this.usuarioRepository.findByEmailWithPassword(credentials.email);
    
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    const isValid = await this.authService.comparePassword(
      credentials.password,
      usuario.password
    );

    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = this.authService.generateToken({
      id: usuario.id_usuario,
      email: usuario.email,
      tipo: usuario.tipo
    });

    return {
      token,
      usuario: {
        id: usuario.id_usuario,
        email: usuario.email,
        nombre: usuario.nombre,
        tipo: usuario.tipo
      }
    };
  }
}