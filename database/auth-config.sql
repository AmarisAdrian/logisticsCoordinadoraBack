ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;

INSERT INTO coordinadoradb.usuario (nombre,email,password,tipo,fecha_registro,estado) VALUES
	 ('admin','admin@admin.com','$2a$12$dHxuYh.sTHVpY5G8nswvN.W1kZJS8phwOp.gddlQT0G3utduxJp6e','administrador','2025-05-17 17:58:42','activo');