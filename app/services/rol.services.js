import { gestionarRolesDeUsuarioProvider, getRolesProvider } from "../providers/rol.providers.js"
import { logger } from "../utils/winston.logger.js";


export const getRolesServices = async() => {
    try {
        const roles = await getRolesProvider();
        return {
            statusCode: 200,
            roles
        }
    } catch (error) {
        console.error('No se pudieron obtener roles:', error.message);
        logger.error('No se pudieron obtener roles:', error.message);
        return { statusCode: 500, mensaje: 'No se pudieron obtener roles' };
    }
}

export const gestionarRolesDeUsuarioService = async(body, userId) => {
    try {
        const { userID, roles } = body;
        return await gestionarRolesDeUsuarioProvider(userID, roles, userId);
    } catch (error) {
        console.error('No se pudieron agregar o quitar roles:', error.message);
        logger.error('No se pudieron agregar o quitar roles:', error.message);
        return { statusCode: 500, mensaje: 'No se pudieron agregar o quitar roles' };
    }

}