import { Router } from 'express';
import { createAuthRoutes } from './auth.routes';
import { createUserRoutes } from './user.routes';
import { JwtAuthService } from '../../../infrastructure/services/auth/jwt.auth.service';
import { UsuarioMySQLRepository } from '../../../infrastructure/db/mysql/usuario.mysql.repository';
import { AuthController } from '../../../infrastructure/http/controllers/auth.controller';
import { UserController } from '../../../infrastructure/http/controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { UserUseCases } from '../../../application/use-cases/user.use-cases';

export function createRoutes(router: Router): Router {

  const authService = new JwtAuthService( process.env.ACCESS_TOKEN_SECRET!,
    process.env.REFRESH_TOKEN_SECRET!,
    process.env.ACCESS_TOKEN_EXPIRES_IN,
    process.env.REFRESH_TOKEN_EXPIRES_IN);
  const usuarioRepository = new UsuarioMySQLRepository();
  

  const authController = new AuthController(authService, usuarioRepository);
  const userUseCases = new UserUseCases(usuarioRepository, authService);
  const userController = new UserController(userUseCases);
  

  const authMiddlewareInstance = authMiddleware(authService, usuarioRepository);

  router.use('/auth', createAuthRoutes(authController, authMiddlewareInstance));
  router.use('/users', createUserRoutes(userController, authMiddlewareInstance));

  return router;
}