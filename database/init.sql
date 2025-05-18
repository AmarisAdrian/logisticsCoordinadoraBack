CREATE DATABASE IF NOT EXISTS coordinadoradb;
USE coordinadoradb;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    tipo ENUM('cliente', 'administrador', 'transportista') NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    INDEX idx_usuario_email (email),
    INDEX idx_usuario_tipo (tipo)
) ENGINE=InnoDB;


CREATE TABLE vehiculo (
    id_vehiculo INT AUTO_INCREMENT PRIMARY KEY,
    id_transportista INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    capacidad_peso DECIMAL(10,2) NOT NULL,
    capacidad_volumen DECIMAL(10,2) NOT NULL,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    estado ENUM('disponible', 'en_ruta', 'mantenimiento') DEFAULT 'disponible',
    FOREIGN KEY (id_transportista) REFERENCES usuario(id_usuario),
    INDEX idx_vehiculo_transportista (id_transportista),
    INDEX idx_vehiculo_estado (estado)
) ENGINE=InnoDB;

CREATE TABLE ruta (
    id_ruta INT AUTO_INCREMENT PRIMARY KEY,
    origen VARCHAR(255) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    distancia DECIMAL(10,2) NOT NULL,
    tiempo_estimado INT NOT NULL COMMENT 'Tiempo en minutos',
    estado ENUM('activa', 'inactiva') DEFAULT 'activa',
    INDEX idx_ruta_origen_destino (origen, destino)
) ENGINE=InnoDB;


CREATE TABLE envio (
    id_envio INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_transportista INT,
    id_ruta INT,
    peso DECIMAL(10,2) NOT NULL,
    ancho DECIMAL(10,2) NOT NULL,
    alto DECIMAL(10,2) NOT NULL,
    largo DECIMAL(10,2) NOT NULL,
    tipo_producto VARCHAR(100) NOT NULL,
    direccion_destino TEXT NOT NULL,
    estado ENUM('En espera', 'En tránsito', 'Entregado') DEFAULT 'En espera',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_transportista) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_ruta) REFERENCES ruta(id_ruta),
    INDEX idx_envio_usuario (id_usuario),
    INDEX idx_envio_transportista (id_transportista),
    INDEX idx_envio_ruta (id_ruta),
    INDEX idx_envio_estado (estado),
    INDEX idx_envio_fechas (fecha_creacion, fecha_actualizacion),
    INDEX idx_envio_peso_volumen (peso, ancho, alto, largo)
) ENGINE=InnoDB;

CREATE TABLE estado_envio (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    id_envio INT NOT NULL,
    estado ENUM('En espera', 'En tránsito', 'Entregado') NOT NULL,
    fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (id_envio) REFERENCES envio(id_envio),
    INDEX idx_estado_envio (id_envio),
    INDEX idx_estado_fecha (fecha_cambio)
) ENGINE=InnoDB;

CREATE TABLE reporte_logistico (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,
    fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    periodo_inicio DATE NOT NULL,
    periodo_fin DATE NOT NULL,
    total_envios INT NOT NULL,
    tiempo_promedio_entrega DECIMAL(10,2) NOT NULL COMMENT 'En horas',
    datos_metricas JSON,
    INDEX idx_reporte_periodo (periodo_inicio, periodo_fin)
) ENGINE=InnoDB;


DELIMITER //
CREATE TRIGGER after_envio_state_change
AFTER UPDATE ON envio
FOR EACH ROW
BEGIN
    IF OLD.estado <> NEW.estado THEN
        INSERT INTO estado_envio (id_envio, estado, observaciones)
        VALUES (NEW.id_envio, NEW.estado, CONCAT('Cambio automático de estado: ', OLD.estado, ' → ', NEW.estado));
    END IF;
END//
DELIMITER ;


CREATE VIEW vista_dashboard AS
SELECT 
    e.id_envio,
    u.nombre AS cliente,
    t.nombre AS transportista,
    e.estado,
    e.fecha_creacion,
    e.fecha_actualizacion,
    r.origen,
    r.destino,
    v.matricula AS vehiculo
FROM 
    envio e
JOIN 
    usuario u ON e.id_usuario = u.id_usuario
LEFT JOIN 
    usuario t ON e.id_transportista = t.id_usuario
LEFT JOIN 
    ruta r ON e.id_ruta = r.id_ruta
LEFT JOIN 
    vehiculo v ON v.id_transportista = e.id_transportista;


DELIMITER //
CREATE PROCEDURE generar_reporte_logistico(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    DECLARE v_total_envios INT;
    DECLARE v_tiempo_promedio DECIMAL(10,2);
    
    SELECT 
        COUNT(*),
        AVG(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_actualizacion))
    INTO 
        v_total_envios,
        v_tiempo_promedio
    FROM 
        envio
    WHERE 
        estado = 'Entregado'
        AND fecha_creacion BETWEEN p_fecha_inicio AND p_fecha_fin;
    
  
    INSERT INTO reporte_logistico (
        periodo_inicio,
        periodo_fin,
        total_envios,
        tiempo_promedio_entrega,
        datos_metricas
    )
    VALUES (
        p_fecha_inicio,
        p_fecha_fin,
        v_total_envios,
        v_tiempo_promedio,
        JSON_OBJECT(
            'envios_por_estado', (
                SELECT JSON_OBJECT(
                    'En_espera', COUNT(CASE WHEN estado = 'En espera' THEN 1 END),
                    'En_transito', COUNT(CASE WHEN estado = 'En tránsito' THEN 1 END),
                    'Entregado', COUNT(CASE WHEN estado = 'Entregado' THEN 1 END)
                )
                FROM envio
                WHERE fecha_creacion BETWEEN p_fecha_inicio AND p_fecha_fin
            ),
            'transportistas', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_transportista', u.id_usuario,
                        'nombre', u.nombre,
                        'total_envios', COUNT(e.id_envio),
                        'tiempo_promedio', AVG(TIMESTAMPDIFF(HOUR, e.fecha_creacion, e.fecha_actualizacion))
                    )
                )
                FROM usuario u
                JOIN envio e ON u.id_usuario = e.id_transportista
                WHERE e.fecha_creacion BETWEEN p_fecha_inicio AND p_fecha_fin
                GROUP BY u.id_usuario, u.nombre
            )
        )
    );
    
    SELECT LAST_INSERT_ID() AS id_reporte;
END//
DELIMITER ;