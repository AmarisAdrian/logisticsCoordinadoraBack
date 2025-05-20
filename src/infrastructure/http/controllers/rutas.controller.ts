import { Request, Response } from 'express';
import { RutasUseCases } from '../../../application/use-cases/ruta.use-cases';

export class RutaController {
  constructor(private readonly rutaUseCase: RutasUseCases) {}

  async listRutas(req: Request, res: Response): Promise<void> {
    try {
      const rutas = await this.rutaUseCase.listRutas();
      res.json(rutas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const shipping = await this.rutaUseCase.createShipping(req.body);
      
      return res.status(201).json({
        success: true,
        data: {
          id_envio: shipping.id_envio,
          id_usuario: shipping.id_usuario,
          id_transportista: shipping.id_transportista,
          id_ruta: shipping.id_ruta,
          peso: shipping.peso,
          ancho: shipping.ancho,
          alto: shipping.alto,
          largo: shipping.largo,
          tipo_producto: shipping.tipo_producto,
          direccion_destino: shipping.direccion_destino,
          estado: shipping.estado,
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
}