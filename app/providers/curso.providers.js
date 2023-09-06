import Curso from "../models/curso.model.js";

export const getCursosProvider = async() => {
    try {
        const cursos = await Curso.findAll({
            order: [
                ["nombre", "ASC"]
            ]
        });
        return {
            statusCode: 200,
            data: cursos
        };
    } catch (error) {
        console.error('No se pudieron obtener cursos:', error.message);
        logger.error('No se pudieron obtener cursos:', error.message);
        return { statusCode: 500, mensaje: 'No se pudieron obtener cursos' };
    }
}