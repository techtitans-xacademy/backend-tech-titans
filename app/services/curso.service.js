import { gestionarRolesDeUsuarioProvider, getRolesProvider } from "../providers/rol.providers.js";
import { gestionarCursosProvider, getCursosProvider } from "../providers/curso.providers.js"; // Asegúrate de importar correctamente los providers del modelo Curso
import { logger } from "../utils/winston.logger.js";

export const getRolesServices = async () => {
    try {
        const roles = await getRolesProvider();
        return {
            statusCode: 200,
            roles
        };
    } catch (error) {
        console.error('No se pudieron obtener roles:', error.message);
        logger.error('No se pudieron obtener roles:', error.message);
        return { statusCode: 500, mensaje: 'No se pudieron obtener roles' };
    }
};

export const gestionarRolesDeUsuarioService = async (body, userId) => {
    try {
        const { userID, roles } = body;
        return await gestionarRolesDeUsuarioProvider(userID, roles, userId);
    } catch (error) {
        console.error('No se pudieron agregar o quitar roles:', error.message);
        logger.error('No se pudieron agregar o quitar roles:', error.message);
        return { statusCode: 500, mensaje: 'No se pudieron agregar o quitar roles' };
    }
};

// Servicio para obtener todos los cursos
export const getCursosServices = async () => {
    try {
        const cursos = await getCursosProvider();
        return {
            statusCode: 200,
            cursos
        };
    } catch (error) {
        console.error('No se pudieron obtener cursos:', error.message);
        logger.error('No se pudieron obtener cursos:', error.message);
        return { statusCode: 500, mensaje: 'No se pudieron obtener cursos' };
    }
};

// Servicio para gestionar cursos (Agregar o quitar)
export const gestionarCursosService = async (body, userId) => {
    try {
        // Realiza la lógica correspondiente para gestionar los cursos
        return await gestionarCursosProvider(body, userId);
    } catch (error) {
        console.error('No se pudieron agregar o quitar cursos:', error.message);
        logger.error('No se pudieron agregar o quitar cursos:', error.message);
        return { statusCode: 500, mensaje: 'No se pudieron agregar o quitar cursos' };
    }
};
