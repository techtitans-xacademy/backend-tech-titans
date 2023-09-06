import { config } from "dotenv";
import { deleteDocenteProvider, getDocentePorIdProvider, getDocentesProvider, newDocenteProvider, restoreDocenteProvider, updateDocenteProvider } from "../providers/docente.providers.js";
config();

export const getDocentesService = async(query) => {
    const { l, p, borrado = false } = query;

    const limit = parseInt(l) || parseInt(process.env.PAGE_SIZE);
    const page = parseInt(p) || 1;
    const deleteReg = Boolean(borrado);

    return await getDocentesProvider(limit, page, deleteReg);
}

export const getDocentePorIdService = async(params) => {
    const { id } = params;

    return await getDocentePorIdProvider(id);
}

export const newDocenteService = async(body, userId, files) => {
    const { nombre, apellido, email } = body;
    const { imageFile } = files;

    let docente = {
        nombre,
        apellido,
        email,
        usuarioId: userId
    }

    return await newDocenteProvider(docente, imageFile);
}

export const updateDocenteService = async(params, body, userId, files) => {
    const { id } = params;
    const { nombre, apellido, email } = body;
    const { imageFile } = files;

    let docente = {
        nombre,
        apellido,
        email,
        usuarioId: userId
    }

    return await updateDocenteProvider(id, docente, imageFile);
}

export const deleteDocenteService = async(params) => {
    const { id } = params;

    return await deleteDocenteProvider(id);
}

export const restoreDocenteService = async(params) => {
    const { id } = params;

    return await restoreDocenteProvider(id);
}