import { Router } from 'express';
import { UserController } from '../../../infrastructure/http/controllers/user.controller';
import { RequestHandler } from 'express';

export function createUserRoutes(
  userController: UserController,
  authenticate: RequestHandler
): Router {
  const router = Router();
/**
 * @swagger
 * /users/:
 *   get:
 *     tags: [Users]
 *     summary: Obtiene la lista de usuarios
 *     description: Retorna un array con todos los usuarios registrados
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Límite de resultados por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 * 
 *   post:
 *     tags: [Users]
 *     summary: Registra un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *               - tipo
 *               - fecha_registro
 *               - estado
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@ejemplo.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *               tipo:
 *                 type: string
 *                 example: "cliente"
 *               fecha_registro:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-01"
 *               estado:
 *                 type: string
 *                 example: "activo"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Campos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
  router.post('/register', userController.register.bind(userController));
  router.get('/', authenticate, userController.listUsers.bind(userController));
  router.get('/:id', authenticate, userController.getProfile.bind(userController));
  router.get('/search/:tipo', authenticate, userController.getUserByTipo.bind(userController))
  return router;
}