export interface Ruta {
  id_ruta?: number;
  origen: string;
  destino: string;
  distancia: number;
  tiempo_estimado: number;
  estado?: 'activo' | 'inactivo';
}

export interface Shipping {
    id_envio? : number,
    id_usuario : number, 
    id_transportista : number, 
    id_ruta : number ,
    peso : number,
    ancho : number,
    alto : number ,
    largo : number,
    tipo_producto : string ,
    direccion_destino : string,
    estado : 'En espera'| 'En tránsito'| 'Entregado',
    fecha_creacion ?: Date | string,
    fecha_actualizacion ?: Date | string,
}