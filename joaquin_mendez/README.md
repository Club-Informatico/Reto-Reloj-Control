
# Reto Reloj Control

🧑🏽‍💻Reto de crear un sistema de registro de asistencia usando 2FA🧑🏽‍💻

🚧🚧🚧.
## Features

- Backend hecho con typescript con Oak Framework sobre Deno.
- Validaciónes con Javascript.
- Base de datos PostgreSQL y Sequelize.
- Front-end con HTMX y TailwindCSS.
- Corriendo sobre Docker.


## Deployment

Pasos para correr el proyecto con docker.

1- Renombrar archivo .env.example a .env

2- Construir imagen docker compose
```
docker compose build
```

3- Correr imagen docker
```
docker compose up
```

4- Acceder a traves de *http://localhost:3001/*