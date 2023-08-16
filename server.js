import sequelize from "./app/config/database.config.js";
import app from "./app/app.js";
import colors from "colors";
import { logger } from "./app/utils/winston.logger.js";
// import Role from "./models/role.model.js";
// import { createUploadsFolder } from "./helpers/image.helpers.js";

// Verifica si el usuario ya fue creado previamente
// let userCreated = false;
// const createRoleIfNotExists = async(roleName) => {
//     const role = await Role.findOne({ where: { name: roleName } });

//     if (!role) {
//         // El rol no existe, se crea automáticamente
//         await Role.create({ name: roleName });
//         console.log(`Role '${roleName}' has been created successfully.`);
//     } else {
//         console.log(`Role '${roleName}' already exists.`);
//     }
// };


sequelize
    .sync({ alter: true })
    .then(() => {
        console.log(`La conexión a la base de datos se ha establecido con éxito`.bgGreen.white);
        logger.info('La conexión a la base de datos se ha establecido con éxito');
        // createRoleIfNotExists("admin");
        // createRoleIfNotExists("moderator");
        // createRoleIfNotExists("user");
        // createUploadsFolder();
        app.listen(app.get('port'), () => {
            console.log(`El servidor se ejecuta en el puerto: ${app.get('port')} sin problemas. En el entorno de: ${app.get('env')}`.green)
            logger.debug(`El servidor se ejecuta en el puerto: ${app.get('port')} sin problemas. En el entorno de: ${app.get('env')}`)
        });
    })
    .catch((error) => {
        console.log(error);
        logger.error(error);
    });