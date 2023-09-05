import { config } from "dotenv";
import { deleteCategoriaProvider, getCategoriasPorIdProvider, getCategoriasProvider, newCategoriaProvider, restoreCategoriaProvider, updateCategoriaProvider } from "../providers/categoria.providers.js"
config();

export const getCategoriasService = async(query) => {
    const { l, p } = query;

    const limit = parseInt(l) || parseInt(process.env.PAGE_SIZE);
    const page = parseInt(p) || 1;

    return getCategoriasProvider(limit, page);
}

export const getCategoriasPorIdService = async(params) => {
    const { id } = params;

    return getCategoriasPorIdProvider(id);
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