import { Router } from 'express';
import { RutaController } from '../../../infrastructure/http/controllers/rutas.controller';
import { RequestHandler } from 'express';

export function createRutaRoutes(
  rutaController: RutaController,
  authenticate: RequestHandler
): Router {
  const router = Router();
/**
 * @swagger
 * /rutas/:
 *   get:
 *     tags: [rutas]
 *     summary: Obtiene la lista de rutas
 *     description: Retorna un array con todas las rutas registrados
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
 *         description: Lista de rutas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/rutas'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

  router.get('/', authenticate, rutaController.listRutas.bind(rutaController));
  router.post('/register', authenticate, rutaController.register.bind(rutaController));
  return router;
}