import { gestionarRolesDeUsuarioProvider, getRolesProvider } from "../providers/rol.providers.js"
import { logger } from "../utils/winston.logger.js";


export const getRolesServices = async() => {
    return await getRolesProvider();
}

export const gestionarRolesDeUsuarioService = async(body, userId) => {
    const { userID, roles } = body;
    return await gestionarRolesDeUsuarioProvider(userID, roles, userId);
}