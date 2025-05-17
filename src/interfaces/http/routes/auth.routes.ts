// src/interfaces/http/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../../../infrastructure/http/controllers/auth.controller';
import { RequestHandler } from 'express';

export function createAuthRoutes(
  authController: AuthController,
  authenticate: RequestHandler
): Router {
  const router = Router();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Inicia sesión de usuario
 *     description: Retorna tokens de acceso y refresh
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
  router.post('/login', authController.login.bind(authController));
  router.post('/refresh-token', authController.refreshToken.bind(authController));
  router.post('/logout', authenticate, authController.logout.bind(authController));

  return router;
}