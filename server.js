import sequelize from "./app/config/database.config.js";
import app from "./app/app.js";
import colors from "colors";
import { logger } from "./app/utils/winston.logger.js";
import Rol from "./app/models/rol.model.js";
import { createUploadsFolder } from "./app/helpers/image.helpers.js";

// Verifica si el usuario ya fue creado previamente
let userCreated = false;
const createRoleIfNotExists = async(roleName) => {
    const role = await Rol.findOne({ where: { nombre: roleName } });

    if (!role) {
        // El rol no existe, se crea automáticamente
        await Rol.create({ nombre: roleName });
        console.log(`El rol '${roleName}' se ha creado correctamente.`);
        logger.info(`El rol '${roleName}' se ha creado correctamente`)
    } else {
        console.log(`El rol '${roleName}' ya existe.`);
        logger.info(`El rol '${roleName}' ya existe.`);
    }
};


sequelize
    .sync({ force: false })
    .then(() => {
        console.log(`La conexión a la base de datos se ha establecido con éxito`.bgGreen.white);
        logger.info('La conexión a la base de datos se ha establecido con éxito');
        createRoleIfNotExists("admin");
        createRoleIfNotExists("docente");
        createRoleIfNotExists("estudiante");
        createUploadsFolder();
        app.listen(app.get('port'), () => {
            console.log(`El servidor se ejecuta en el puerto: ${app.get('port')} sin problemas. En el entorno de: ${app.get('env')}`.green)
            logger.debug(`El servidor se ejecuta en el puerto: ${app.get('port')} sin problemas. En el entorno de: ${app.get('env')}`)
        });
    })
    .catch((error) => {
        console.log(error);
        logger.error(error);
    });