# 🛠️ Logistics Coordinadora – Backend

Este es el backend del proyecto **Logistics Coordinadora**, desarrollado en **Node.js** con **Express**, siguiendo una arquitectura **Hexagonal** y principios **SOLID**. Se encarga de la lógica de negocio, autenticación, manejo de usuarios, y gestión de datos a través de una base de datos MySQL.

---

## 🚀 Tecnologías

- Node.js v18.19.0
- Express.js
- MySQL
- Docker & Docker Compose
- JWT (autenticación)
- Swagger (documentación de API)
- Arquitectura Hexagonal

---

## 📂 Estructura de Carpetas
src/
├── application/ # Casos de uso y lógica de aplicación
├── core/ # Entidades y puertos
├── infrastructure/ # DB, servicios, controladores, configuración
├── interfaces/ # Rutas y middlewares HTTP
└── shared/ # Elementos reutilizables


---

## ⚙️ Instalación y ejecución con Docker

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/AmarisAdrian/logisticsCoordinadoraBack.git
   cd logisticsCoordinadoraBack
2. Ejecutar los contenedores: docker-compose down && docker-compose build --no-cache --quiet && docker-compose up -d
3. Acceder a la API (por defecto en http://localhost:3000).
4. 🔐 Credenciales de prueba
- Email: admin@admin.com
- Password: 123456

🗃️ Base de Datos
Se genera automáticamente al levantar los contenedores gracias a los seeders configurados.
 - Host: localhost
 - Puerto: 3307
 - Usuario: root
 - Contraseña: root
Base de datos: coordinadoradb

📑 Documentación API
Disponible vía Swagger: http://localhost:3000/api/docs



