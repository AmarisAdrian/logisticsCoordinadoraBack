import { Router } from 'express';
import { createAuthRoutes } from './auth.routes';
import { createUserRoutes } from './user.routes';
import { createRutaRoutes } from './ruta.routes';
import { JwtAuthService } from '../../../infrastructure/services/auth/jwt.auth.service';
import { UsuarioMySQLRepository } from '../../../infrastructure/db/mysql/usuario.mysql.repository';
import { RutaMysqlRepository } from '../../../infrastructure/db/mysql/ruta.mysql.repository';
import { AuthController } from '../../../infrastructure/http/controllers/auth.controller';
import { UserController } from '../../../infrastructure/http/controllers/user.controller';
import { RutaController } from '../../../infrastructure/http/controllers/rutas.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { UserUseCases } from '../../../application/use-cases/user.use-cases';
import { RutasUseCases } from '../../../application/use-cases/ruta.use-cases';

export function createRoutes(router: Router): Router {

  const authService = new JwtAuthService( process.env.ACCESS_TOKEN_SECRET!,
    process.env.REFRESH_TOKEN_SECRET!,
    process.env.ACCESS_TOKEN_EXPIRES_IN,
    process.env.REFRESH_TOKEN_EXPIRES_IN);
  const usuarioRepository = new UsuarioMySQLRepository();
  const RutaRepository = new RutaMysqlRepository();

  const authController = new AuthController(authService, usuarioRepository);
  const userUseCases = new UserUseCases(usuarioRepository, authService);
  const userController = new UserController(userUseCases);

  const rutasUseCases = new RutasUseCases(RutaRepository, authService);
  const rutaController = new RutaController(rutasUseCases);

  const authMiddlewareInstance = authMiddleware(authService, usuarioRepository);

  router.use('/auth',  createAuthRoutes(authController, authMiddlewareInstance));
  router.use('/users', createUserRoutes(userController, authMiddlewareInstance));
  router.use('/rutas', createRutaRoutes(rutaController, authMiddlewareInstance));  
  return router;
}