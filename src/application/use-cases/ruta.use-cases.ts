import { RutaRepository } from '../../core/ports/repositories/ruta.repository';
import { AuthService } from '../../core/ports/services/auth.service';
import { ShippingDto,Shipping } from '../../core/entities/shipping.dto';


export class RutasUseCases {
  constructor(private readonly rutaRepository: RutaRepository,
     private readonly authService: AuthService
  ) {}

  async listRutas() {
    return this.rutaRepository.findAll();
  }
  async createShipping(shippingData: ShippingDto): Promise<Shipping> {
      const newUserData: Omit<Shipping, 'id_envio'> = {
      ...shippingData
    };
    const newShipping = await this.rutaRepository.create(newUserData);
    return newShipping as Shipping;
  }
}