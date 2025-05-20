import { MySQLRepository } from './mysql.repository';
import { RutaRepository } from '../../../core/ports/repositories/ruta.repository';
import { Ruta,Shipping } from '../../../core/entities/ruta.entity';
import { Console } from 'console';

export class RutaMysqlRepository extends MySQLRepository implements RutaRepository {

  constructor() {
    super();
  }
  async findAll(): Promise<Ruta[]> {
    const sql = 'SELECT * FROM ruta';
    return this.query<Ruta[]>(sql);
  }
   async create(envio: Omit<Shipping, 'id_envio'>): Promise<Shipping> {
       try {
         
         if (!envio || typeof envio !== 'object') {
           throw new Error('Datos de usuario inválidos: no es un objeto');
          }
          const { id_usuario, id_transportista, id_ruta, peso, ancho, alto, largo, tipo_producto, direccion_destino } = envio;    
          const estado = envio.estado ?? 'en espera';

          const sql = `
              INSERT INTO envio 
              (id_usuario, id_transportista, id_ruta, peso, ancho, alto, largo, tipo_producto, direccion_destino,estado)
              VALUES (? , ? , ? , ? , ?, ? , ?, ? , ?,? )
          `;     
  
          const result = await this.execute(sql, [
              id_usuario, id_transportista, id_ruta, peso, ancho, alto, largo, tipo_producto, direccion_destino,estado
          ]);        
  
          return { 
              ...envio, 
              id_envio: result.insertId 
          };
      } catch (error: any) {  
         throw new Error(`Error al crear un envio en la base de datos/*: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
      }
    }

}