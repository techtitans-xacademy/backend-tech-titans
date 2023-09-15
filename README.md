# BackendTechTitans

Bakend hecho con NodeJS con el framework de express y el orm de sequelize consumiendo una base de datos en mysql para el proyecto de TechTitans


## Tecnologias usadas

**Server:** Node, Express, Sequelize, MySQL


## Variables de entornos

Para ejecutar este proyecto, deberá agregar las siguientes variables de entorno a su archivo `.env` en la raiz del proyecto. O copiar el archivo `.env.example` y renombrarlo como `.env`

`TZ`

`API_PORT`

`JWT_SECRET`

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

`HOST_FRONT_EMAIL`

`UPLOAD_PRESET`

`CLOUDINARY_API_KEY`

`CLOUDINARY_API_SECRET`

`CLOUDINARY_NAME`

`APP`

`NAME_MAIL`

`USER_MAIL`

`PASS_MAIL`

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

Copiar el archivo `.env.example` en `.env` para que el proyecto funcione

```bash
  cp .env.example .env
```
***Tanto en linux como en Windows los comandos son iguales***

Luego rellenar todos los campos del `.env` para que el proyecto funcione.

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
📁 backend-tech-titans/
├───📁 app/
│   ├───📁 config/
|   |   ├───📁 file/
│   │   |    └───📄 .gitkeep
|   |   ├───📄 cloudinary.config.js
│   │   └───📄 database.config.js
│   ├───📁 controllers/
│   │   ├───📄 auth.controllers.js
│   │   ├───📄 categoria.controllers.js
│   │   ├───📄 curso.controllers.js
│   │   ├───📄 docente.controllers.js
│   │   ├───📄 rol.controllers.js
│   │   └───📄 usuario.controllers.js
│   ├───📁 database/
│   |   ├───📁 migrations/
│   │   |    └───📄.gitkeep
│   |   ├───📁 seeders/
│   │   |    └───📄.gitkeep
│   │   └───📄.gitkeep
│   ├───📁 exceptions/
│   │   └───📄base.exceptions.js
│   ├───📁 helpers/
|   |   ├───📄 generatePasswordFake.helpers.js
|   |   ├───📄 generateTokens.helpers.js
|   |   ├───📄 image.helpers.js
│   │   └───📄 validate.helpers.js
│   ├───📁 mails/
│   |   ├───📁 pages/
|   |   |   ├───📄 account_data.html
|   |   |   ├───📄 confirm.html
|   |   |   ├───📄 forgot.html
|   |   |   ├───📄 new_password.html
│   │   |   └───📄 password_ok.html
│   │   └───📄config.mails.js
│   ├───📁 middleware/
│   │   ├───📄 error_handler.middleware.js
│   │   ├───📄 register.middleware.js
│   │   ├───📄 root_path.middleware.js
│   │   └───📄 verifyUser.middleware.js
│   ├───📁 models/
|   |   ├───📄 asistencia.model.js
|   |   ├───📄 categoria.model.js
|   |   ├───📄 curso.model.js
|   |   ├───📄 docente.model.js
|   |   ├───📄 pago.model.js
|   |   ├───📄 relaciones.model.js
|   |   ├───📄 rol.model.js
|   |   ├───📄 usuario.model.js
│   │   └───📄 usuarios_roles.model.js
│   ├───📁 providers/
│   │   ├───📄 auth.providers.js
│   │   ├───📄 categoria.providers.js
│   │   ├───📄 curso.providers.js
│   │   ├───📄 docente.providers.js
│   │   ├───📄 rol.providers.js
│   │   └───📄 usuario.providers.js
│   ├───📁 routes/
│   │   ├───📄 auth.routes.js
│   │   ├───📄 categoria.routes.js
│   │   ├───📄 curso.routes.js
│   │   ├───📄 docentes.routes.js
│   │   ├───📄 index.routes.js
│   │   └───📄 usuario.routes.js
│   ├───📁 services/
│   │   ├───📄 auth.services.js
│   │   ├───📄 categoria.services.js
│   │   ├───📄 curso.services.js
│   │   ├───📄 categoria.services.js
│   │   ├───📄 rol.services.js
│   │   └───📄 usuario.services.js
│   ├───📁 themes/
│   │   └───📄.gitkeep
│   ├───📁 utils/
│   │   ├───📄 blacklist-email.js
│   │   ├───📄 createSlug.js
│   │   ├───📄 validateEnv.js
│   │   └───📄 winston.logger.js
│   └───📁 validations/
│       ├───📄 auth.validations.js
│       ├───📄 categoria.validations.js
│       ├───📄 curso.validations.js
│       ├───📄 docente.validations.js
│       └───📄 usuario.validations.js
├───📄 .env.example
├───📄 package-lock.json
├───📄 package.json
├───📄 README.md
└───📄 server.js
```

## Quien desarrollo esta api

- [@FabrizioFerroni](https://www.github.com/FabrizioFerroni)