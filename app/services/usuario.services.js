import { config } from "dotenv";
import { changeEstadoUsuarioProvider, deleteUsuarioProvider, getUsuarioByIdProvider, getUsuariosProvider, restoreUsuarioProvider, updateUsuarioProvider } from "../providers/usuario.providers.js";
config();

export const getUsuariosService = async(query) => {
    const { l, p, borrado = false } = query;

    const limit = parseInt(l) || parseInt(process.env.PAGE_SIZE);
    const page = parseInt(p) || 1;
    const deleteReg = Boolean(borrado);

    return await getUsuariosProvider(limit, page, deleteReg);
}

export const getUsuarioByIdService = async(params) => {
    const { id } = params;

    return await getUsuarioByIdProvider(id);
}

export const getUsuarioLogueadoService = async(userID) => {
    return await getUsuarioByIdProvider(userID);
}

export const updateUsuarioService = async(params, body, files) => {
    const { id } = params;
    const { nombre, apellido } = body;
    const { imageFile } = files;

    let user = {
        nombre,
        apellido
    }

    return await updateUsuarioProvider(id, user, imageFile);
}

export const changeEstadoUsuarioService = async(params, body, userId) => {
    const { id } = params;
    const { status } = body;

    let user = {
        status
    }

    return await changeEstadoUsuarioProvider(id, user, userId);
}

export const deleteUsuarioService = async(params, userId) => {
    const { id } = params;

    return await deleteUsuarioProvider(id, userId);
}

export const restoreUsuarioService = async(params) => {
    const { id } = params;

    return await restoreUsuarioProvider(id);
}