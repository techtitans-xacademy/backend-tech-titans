import { getCursosProvider } from "../providers/curso.providers.js"; // Asegúrate de importar correctamente los providers del modelo Curso
import { logger } from "../utils/winston.logger.js";


// Servicio para obtener todos los cursos
export const getCursosServices = async() => {
    return await getCursosProvider();
};