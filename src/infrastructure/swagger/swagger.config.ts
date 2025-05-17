
import * as swaggerJsdoc from 'swagger-jsdoc';
import { Application } from 'express';
import * as swaggerUi from 'swagger-ui-express';


// Configuración básica de Swagger
const options = {
  definition: {
    openapi: '3.0.0',  // Versión de OpenAPI
    info: {
      title: 'API Coordinadora',
      description: 'API para el sistema de gestión logística',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // Aquí puedes definir esquemas comunes
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: [
    './src/interfaces/http/**/*.ts',  // Ruta a tus controladores
    './src/core/entities/*.dto.ts'    // Ruta a tus DTOs
  ]
};

// Genera la especificación Swagger/OpenAPI
const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};