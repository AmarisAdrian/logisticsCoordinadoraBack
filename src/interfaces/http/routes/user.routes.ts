import { Router } from 'express';
import { UserController } from '../../../infrastructure/http/controllers/user.controller';
import { RequestHandler } from 'express';

export function createUserRoutes(
  userController: UserController,
  authenticate: RequestHandler
): Router {
  const router = Router();

  router.post('/register', userController.register.bind(userController));
  router.get('/', userController.listUsers.bind(userController));

  return router;
}