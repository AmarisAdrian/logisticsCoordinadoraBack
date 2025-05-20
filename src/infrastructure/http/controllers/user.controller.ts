// src/infrastructure/http/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UpdateUserDto } from '../../../core/entities/user.dto';
import { UserUseCases } from '../../../application/use-cases/user.use-cases';

export class UserController {
  constructor(private readonly userUseCases: UserUseCases) {}

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userUseCases.createUser(req.body);
      
      return res.status(201).json({
        success: true,
        data: {
          id: user.id_usuario,
          nombre: user.nombre,
          email: user.email,
          tipo: user.tipo,
          estado: user.estado
        }
      });
      
    } catch (error) {
      console.error('Error en register:', error);
 
      return res.status(400).json({
        success: false,
        error: error.message || 'Error al registrar usuario*',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }


  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await this.userUseCases.getUserProfile(userId);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  async getUserByTipo(req: Request, res: Response): Promise<void> {
    try {
      const tipo = req.params.tipo; 
      const user = await this.userUseCases.getByTipo(tipo);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
   async getUser(req: Request, res: Response): Promise<void> {
    try {
      const nombre = (req as any).user.id;
      const user = await this.userUseCases.getUser(nombre);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const updateData: UpdateUserDto = req.body;
      const updatedUser = await this.userUseCases.updateUser(userId, updateData);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userUseCases.listUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}