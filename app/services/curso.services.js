import { getCursosProvider } from "../providers/curso.providers.js"; // Asegúrate de importar correctamente los providers del modelo Curso
import { logger } from "../utils/winston.logger.js";


// Servicio para obtener todos los cursos
export const getCursosServices = async() => {
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