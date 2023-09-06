import { getRolesServices, gestionarRolesDeUsuarioService } from "../services/rol.services.js";

export const getRoles = async(req, res) => {
    try {
        const rolService = await getRolesServices();
        const { statusCode, ...responseData } = rolService;
        res.status(statusCode).json(responseData);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
}

export const addorquiteRoles = async(req, res) => {
    try {
        const rolService = await gestionarRolesDeUsuarioService(req.body, req.userId);
        const { statusCode, ...responseData } = rolService;
        res.status(statusCode).json(responseData);
    } catch (err) {
        res.status(500).json({ mensaje: err.message });
    }
}