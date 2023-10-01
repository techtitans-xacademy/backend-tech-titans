import { config } from "dotenv";
import { deleteCursoProvider, getCursoByIdProvider, getCursoBySlugProvider, getCursosByCategoriaProvider, getCursosByUserLoggedProvider, getCursosProvider, newCursoProvider, restoreCursoProvider, updateCursoProvider } from "../providers/curso.providers.js";
import { getCategoriasPorIdProvider } from "../providers/categoria.providers.js";
config();

export const getCursosServices = async(query) => {
    const { l, p, borrado = false } = query;

    const limit = parseInt(l) || parseInt(process.env.PAGE_SIZE);
    const page = parseInt(p) || 1;
    const deleteReg = Boolean(borrado);

    return await getCursosProvider(limit, page, deleteReg);
};


export const getCursosByUserLoggedServices = async(query, userId) => {
    const { l, p, borrado = false } = query;

    const limit = parseInt(l) || parseInt(process.env.PAGE_SIZE);
    const page = parseInt(p) || 1;
    const deleteReg = Boolean(borrado);

    return await getCursosByUserLoggedProvider(limit, page, deleteReg, userId);
};

export const getCursoByIdService = async(id) => {
    return await getCursoByIdProvider(id);
}

export const getCursoBySlugService = async(slug) => {
    return await getCursoBySlugProvider(slug);
}

export const getCursosByCategoriaService = async(query, params) => {
    const { l, p } = query;
    const { slug } = params;

    const limit = parseInt(l) || parseInt(process.env.PAGE_SIZE);
    const page = parseInt(p) || 1;

    return await getCursosByCategoriaProvider(limit, page, slug);
}

export const newCursoService = async(body, files, userId) => {
    const { nombre, descripcion, dia, hora, duracion, precio, categoriaId, docenteId } = body
    const { imageFile } = files


    const catExist = await getCategoriasPorIdProvider(categoriaId);

    if (catExist.statusCode === 404) {
        return {
            statusCode: 404,
            mensaje: 'La categoria que intentas asignar al curso no existe'
        }
    }

    const cursoObj = {
        nombre,
        descripcion,
        'dia_curso': dia,
        'hora_curso': hora,
        duracion,
        precio,
        categoriaId,
        usuarioId: userId,
        docenteId
    }

    return await newCursoProvider(cursoObj, imageFile)
}

export const updateCursoService = async(params, body, files, userId) => {
    const { id } = params;
    const { nombre, descripcion, dia, hora, duracion, precio, categoriaId } = body
    const { imageFile } = files

    const cursoObj = {
        nombre,
        descripcion,
        'dia_curso': dia,
        'hora_curso': hora,
        duracion,
        precio,
        categoriaId,
        usuarioId: userId
    }

    return await updateCursoProvider(id, cursoObj, imageFile)
}

export const deleteCursoService = async(params) => {
    const { id } = params;

    return await deleteCursoProvider(id);
}

export const restoreCursoService = async(params) => {
    const { id } = params;

    return await restoreCursoProvider(id);
}