import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../core/ports/services/auth.service';
import { UsuarioRepository } from '../../../core/ports/repositories/usuario.repository';
import { TokenPayload } from '../../../core/entities/token-payload.entity';

export function authMiddleware(
  authService: AuthService,
  usuarioRepository: UsuarioRepository,
  allowedRoles?: string[]
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractTokenFromHeader(req);
      if (!token) throw new Error('Token no proporcionado');

      const decoded = authService.verifyToken(token) as TokenPayload;
    
      if (decoded.tokenVersion !== undefined) {
        const user = await usuarioRepository.findByIdWithTokenVersion(decoded.id);
        if (!user || user.tokenVersion !== decoded.tokenVersion) {
          throw new Error('Token inválido');
        }
      }

      (req as any).user = decoded;
      
      if (allowedRoles && !allowedRoles.includes(decoded.tipo)) {
        throw new Error('Permisos insuficientes');
      }

      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
}

export function refreshTokenMiddleware(authService: AuthService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error('Refresh token requerido');
      const decoded = authService.verifyToken(refreshToken) as TokenPayload;
      
      if (!decoded.isRefreshToken) {
        throw new Error('Token no es un refresh token válido');
      }

      (req as any).refreshToken = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
}

function extractTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}