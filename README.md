# BackendTechTitans

Bakend hecho con NodeJS con el framework de express y el orm de sequelize consumiendo una base de datos en mysql para el proyecto de TechTitans


## Tecnologias usadas

**Server:** Node, Express, Sequelize, MySQL


## Variables de entornos

Para ejecutar este proyecto, deberá agregar las siguientes variables de entorno a su archivo `.env` en la raiz del proyecto. O copiar el archivo `.env.example` y renombrarlo como `.env`

`TZ`

`API_PORT`

`SECRET_KEY`

`NODE_ENV`

`DB_USER`

`DB_PASS`

`DB_NAME`

`DB_HOST`

`DB_PORT`

`DB_DIALECT`

`LOG_LEVEL`

`API_HOST`

`HOST_FRONT`

### Pre-requisitos 📋

Para poder ejecutar bien este proyecto se necesita tener instalado la version de node LTS

```
Node v18.16.1. Se descarga en: https://nodejs.org/en
```
## Ejecutar localmente el servidor

Clonar el proyecto

```bash
  git clone https://github.com/techtitans-xacademy/backend-tech-titans.git
```

Ir al directorio del proyecto

```bash
  cd backend-tech-titans
```

Instalar dependencias

```bash
  npm install
```
Iniciar el servidor

```bash
  npm run dev
```

Ir al navegador/postman/frontend y pegar la siguiente ruta  

```bash
  http://localhost:8080/
```
***El puerto se setea en el archivo `.env` si no por defecto es el 8080***

## Mapa de la aplicación

Así se encuentra organizado el proyecto en cuestión.

```
📁 backendtechtitans/
├───📁 app/
│   ├───📁 config/
|   |   ├───📁 file/
│   │   |    └───📄 .gitkeep
|   |   ├───📄 cloudinary.config.js
│   │   └───📄 database.config.js
│   ├───📁 controllers/
│   │   └───📄.gitkeep
│   ├───📁 database/
│   |   ├───📁 migrations/
│   │   |    └───📄.gitkeep
│   |   ├───📁 seeders/
│   │   |    └───📄.gitkeep
│   │   └───📄.gitkeep
│   ├───📁 exceptions/
│   │   └───📄base.exceptions.js
│   ├───📁 helpers/
│   │   └───📄 validate.helpers.js
│   ├───📁 mails/
│   |   ├───📁 pages/
│   │   |    └───📄.gitkeep
│   │   └───📄config.mails.js
│   ├───📁 middleware/
│   │   ├───📄 error_handler.middleware.js
│   │   └───📄 root_path.middleware.js
│   ├───📁 models/
│   │   └───📄.gitkeep
│   ├───📁 providers/
│   │   └───📄.gitkeep
│   ├───📁 routes/
│   │   └───📄index.routes.js
│   ├───📁 services/
│   │   └───📄.gitkeep
│   ├───📁 themes/
│   │   └───📄.gitkeep
│   ├───📁 utils/
│   │   ├───📄 validateEnv.js
│   │   └───📄 winston.logger.js
│   └───📁 validations/
│       └───📄.gitkeep
├───📄 .env.example
├───📄 package-lock.json
├───📄 package.json
├───📄 README.md
└───📄 server.js
```

## Quien desarrollo esta api

- [@FabrizioFerroni](https://www.github.com/FabrizioFerroni)
- [@Hernan](https://www.github.com/)