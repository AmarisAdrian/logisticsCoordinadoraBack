// src/infrastructure/http/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { JwtAuthService } from '../../services/auth/jwt.auth.service';
import { UsuarioRepository } from '../../../core/ports/repositories/usuario.repository';
import { LoginDto } from '../../../core/entities/auth.dto';

export class AuthController {
  constructor(
    private readonly authService: JwtAuthService,
    private readonly usuarioRepository: UsuarioRepository
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginDto = req.body;
      const user = await this.usuarioRepository.findByEmailWithPassword(credentials.email);
      
      if (!user) throw new Error('Credenciales inválidas');

      const isValid = await this.authService.comparePassword(
        credentials.password,
        user.password
      );

      if (!isValid) throw new Error('Credenciales inválidas');

      const token = this.authService.generateToken({
        id: user.id_usuario,
        email: user.email,
        tipo: user.tipo
      });

      const refreshToken = this.authService.generateRefreshToken({
        id: user.id_usuario,
        email: user.email,
        tipo: user.tipo
      });

      res.json({ token, refreshToken, usuario: {
        id: user.id_usuario,
        email: user.email,
        nombre: user.nombre,
        tipo: user.tipo
      } });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const decoded = this.authService.verifyToken(refreshToken, true);
      
      const user = await this.usuarioRepository.findById(decoded.id);
      if (!user) throw new Error('Usuario no encontrado');

      const newToken = this.authService.generateToken({
        id: user.id_usuario,
        email: user.email,
        tipo: user.tipo
      });

      res.json({ token: newToken });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      await this.usuarioRepository.incrementTokenVersion(userId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}