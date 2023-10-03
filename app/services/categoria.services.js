import { config } from "dotenv";
import { deleteCategoriaProvider, getCategoriasPorIdProvider, getCategoriasPorSlugProvider, getCategoriasProvider, newCategoriaProvider, restoreCategoriaProvider, updateCategoriaProvider } from "../providers/categoria.providers.js"
config();

export const getCategoriasService = async(query) => {
    const { l, p, borrado = false } = query;

    const limit = parseInt(l) || parseInt(process.env.PAGE_SIZE);
    const page = parseInt(p) || 1;
    const deleteReg = Boolean(borrado);

    return getCategoriasProvider(limit, page, deleteReg);
}

export const getCategoriasPorIdService = async(id) => {
    return getCategoriasPorIdProvider(id);
}

export const getCategoriasPorSlugService = async(slug) => {
    return getCategoriasPorSlugProvider(slug);
}

export const newCategoriaService = async(body, userId) => {
    const { nombre } = body;

    return newCategoriaProvider(nombre, userId);
}

export const updateCategoriaService = async(params, body, userId) => {
    const { id } = params;
    const { nombre } = body;

    return updateCategoriaProvider(id, nombre, userId);
}

export const deleteCategoriasService = async(params) => {
    const { id } = params;

    return deleteCategoriaProvider(id);
}

export const restoreCategoriasService = async(params) => {
    const { id } = params;

    return restoreCategoriaProvider(id);
}