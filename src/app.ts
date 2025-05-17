import express = require('express');
import { createRoutes } from './interfaces/http/routes';
import { setupSwagger } from './infrastructure/swagger/swagger.config';


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
    this.app.listen(port, () => {
      console.log(`🟢 Servidor corriendo en http://localhost:${port}`);
      console.log(`Swagger disponible en http://localhost:${port}/api-docs`);
    });
  }
}

const app = new App();
app.start(Number(process.env.PORT) || 3000);