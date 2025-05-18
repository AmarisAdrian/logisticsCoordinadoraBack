// src/infrastructure/http/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UpdateUserDto } from '../../../core/entities/user.dto';
import { UserUseCases } from '../../../application/use-cases/user.use-cases';

export class UserController {
  constructor(private readonly userUseCases: UserUseCases) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userUseCases.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
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