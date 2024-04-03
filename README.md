


# Project CEUPRO BACKEND  NodeJS + ExpressJS + TypeScript + Postgres + PrismaORM

Este proyecto esta desarrollado para la carrera de Ingeniería de Sistemas - Universidad Privada Franz Tamayo - La Paz 


## Instalación

1. Clonar .env.template a .env y configurar las variables de entorno
2. Ejecutar `yarn` para instalar las dependencias
3. En caso de necesitar base de datos, configurar el docker-compose.yml y ejecutar `docker-compose up -d` para levantar los servicios deseados.
4. Crear la base de datos en postgres 
5. Ejecutar `yarn dev` para levantar el proyecto en modo desarrollo
6. Ejecutar `npx prisma migrate dev` para realizar la migración y el seeder
7. Si es necesario solo realizar el seeder, ejecutar`npx prisma db seed`
8. Si es necesario reiniciar la migración, ejecutar `npx prisma migrate reset` o solo borrar la carpeta "migrations" y ejecutar el paso 6