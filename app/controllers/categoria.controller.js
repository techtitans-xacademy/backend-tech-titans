import { deleteCategoriasService, getCategoriasPorIdService, getCategoriasPorSlugService, getCategoriasService, newCategoriaService, restoreCategoriasService, updateCategoriaService } from "../services/categoria.services.js";

export async function getCategorias(req, res) {
    try {
        const data = await getCategoriasService(req.query);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function getCategoriasPorIdOrSlug(req, res) {
    try {
        const input = req.params.params;

        switch (true) {
            case /^\d+$/.test(input):
                {
                    const data = await getCategoriasPorIdService(input);
                    const { statusCode, ...responseData } = data;
                    res.status(statusCode).json(responseData);
                    break;
                }
            case /^[a-zA-Z0-9-]+$/.test(input):
                {
                    const data = await getCategoriasPorSlugService(input);
                    const { statusCode, ...responseData } = data;
                    res.status(statusCode).json(responseData);
                    break;
                }
            default:
                {
                    res.status(400).json({ mensaje: "La cadena debe contener solo letras y números." });
                    break;
                }
        }
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