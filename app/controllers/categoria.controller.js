import { deleteCategoriasService, getCategoriasPorIdService, getCategoriasService, newCategoriaService, restoreCategoriasService, updateCategoriaService } from "../services/categoria.services.js";

export async function getCategorias(req, res) {
    try {
        const data = await getCategoriasService(req.query);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function getCategoriasPorID(req, res) {
    try {
        const data = await getCategoriasPorIdService(req.params);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function newCategoria(req, res) {
    try {
        const data = await newCategoriaService(req.body, req.userId);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function updateCategoria(req, res) {
    try {
        const data = await updateCategoriaService(req.params, req.body, req.userId);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function deleteCategoria(req, res) {
    try {
        const data = await deleteCategoriasService(req.params);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function restoreCategoria(req, res) {
    try {
        const data = await restoreCategoriasService(req.params);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}