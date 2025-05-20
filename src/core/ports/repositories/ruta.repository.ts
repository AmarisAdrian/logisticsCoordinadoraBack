import { Ruta,Shipping } from '../../entities/ruta.entity';

export interface RutaRepository {
  findAll(): Promise<Ruta[]>;
  create(envio: Omit<Shipping, 'id_envio'>): Promise<Shipping>;
}