// src/interfaces/http/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../../../infrastructure/http/controllers/auth.controller';
import { RequestHandler } from 'express';

export function createAuthRoutes(
  authController: AuthController,
  authenticate: RequestHandler
): Router {
  const router = Router();

  router.post('/login', authController.login.bind(authController));
  router.post('/refresh-token', authController.refreshToken.bind(authController));
  router.post('/logout', authenticate, authController.logout.bind(authController));

  return router;
}