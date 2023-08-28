import { getRolesServices, gestionarRolesDeUsuarioService } from "../services/rol.services.js";
import Curso from "../models/curso"; // REVISAR importar correctamente el modelo Curso

export const getRoles = async (req, res) => {
    try {
        const rolService = await getRolesServices();
        const { statusCode, ...responseData } = rolService;
        res.status(statusCode).json(responseData);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

export const addOrQuiteRoles = async (req, res) => {
    try {
        const rolService = await gestionarRolesDeUsuarioService(req.body, req.userId);
        const { statusCode, ...responseData } = rolService;
        res.status(statusCode).json(responseData);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// Controlador para obtener todos los cursos
export const getCursos = async (req, res) => {
    try {
        const cursos = await Curso.findAll();
        res.status(200).json(cursos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los cursos', error: error.message });
    }
};
