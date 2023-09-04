import { getCursosServices } from "../services/curso.services.js";


// Controlador para obtener todos los cursos
export const getCursos = async(req, res) => {
    try {
        const cursosService = await getCursosServices();
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los cursos', error: error.message });
    }
};