import { changeEstadoUsuarioService, deleteUsuarioService, getUsuarioByIdService, getUsuarioLogueadoService, getUsuariosService, restoreUsuarioService, updateUsuarioService } from "../services/usuario.services.js";

export const getUsuarios = async(req, res) => {
    try {
        const usuariosService = await getUsuariosService(req.query);
        const { statusCode, ...responseData } = usuariosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
    }
}

export const getUsuarioById = async(req, res) => {
    try {
        const usuariosService = await getUsuarioByIdService(req.params);
        const { statusCode, ...responseData } = usuariosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al obtener el usuario buscado por id' });
    }
}

export const getUsuarioLogueado = async(req, res) => {
    try {
        const usuariosService = await getUsuarioLogueadoService(req.userId);
        const { statusCode, ...responseData } = usuariosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al obtener el usuario logueado' });
    }
}

export const updateUsuario = async(req, res) => {
    try {
        const usuariosService = await updateUsuarioService(req.params, req.body, req.files);
        const { statusCode, ...responseData } = usuariosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
    }
}

export const changeEstadoUsuario = async(req, res) => {
    try {
        const usuariosService = await changeEstadoUsuarioService(req.params, req.body, req.userId);
        const { statusCode, ...responseData } = usuariosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al cambiar el estado al usuario' });
    }
}

export const deleteUsuario = async(req, res) => {
    try {
        const usuariosService = await deleteUsuarioService(req.params, req.userId);
        const { statusCode, ...responseData } = usuariosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
    }
}

export const restoreUsuario = async(req, res) => {
    try {
        const usuariosService = await restoreUsuarioService(req.params);
        const { statusCode, ...responseData } = usuariosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al restaurar el usuario' });
    }
}