import express = require('express');
import { createRoutes } from './interfaces/http/routes';
import { setupSwagger } from './infrastructure/swagger/swagger.config';
import cors = require('cors');
import dotenv = require('dotenv');

dotenv.config();


export class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
    setupSwagger(this.app); 
  }

  private configureMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';
    this.app.use(cors({
      origin,
      credentials: true
    }));
  }

  private configureRoutes(): void {
    const router = express.Router();
    this.app.use('/api/v1', createRoutes(router));
  }

  private configureErrorHandling(): void {
    this.app.use(this.errorHandler);
  }

  private errorHandler(
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }

 public start(port: number): void {
  this.app.listen(port, '0.0.0.0', () => {
    console.log(`🟢 Servidor corriendo en http://localhost:${port}`);
    console.log(`Swagger disponible en http://localhost:${port}/api-docs`);
  });
}

}

const app = new App();
app.start(Number(process.env.PORT) || 3000);