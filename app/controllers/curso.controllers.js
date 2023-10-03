import { deleteCursoService, getCursoByIdService, getCursoBySlugService, getCursosByCategoriaService, getCursosByUserLoggedServices, getCursosServices, newCursoService, restoreCursoService, updateCursoService } from "../services/curso.services.js";


export const getCursos = async(req, res) => {
    try {
        const cursosService = await getCursosServices(req.query);
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al obtener los cursos' });
    }
};

export const getCursosByUserLogged = async(req, res) => {
    try {
        const cursosService = await getCursosByUserLoggedServices(req.query, req.userId);
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al obtener los cursos' });
    }
};

export const getCursoByIdOrSlug = async(req, res) => {
    try {
        const input = req.params.params;

        switch (true) {
            case /^\d+$/.test(input):
                {
                    const cursoService = await getCursoByIdService(input);
                    const { statusCode, ...responseData } = cursoService;
                    res.status(statusCode).json(responseData);
                    break;
                }
            case /^[a-zA-Z0-9-]+$/.test(input):
                {
                    const cursoService = await getCursoBySlugService(input);
                    const { statusCode, ...responseData } = cursoService;
                    res.status(statusCode).json(responseData);
                    break;
                }
            default:
                {
                    res.status(400).json({ mensaje: "La cadena debe contener solo letras y números." });
                    break;
                }
        }
        // if (!isNaN(req.params.params)) {
        //     const id = req.params.params;
        //     const cursoService = await getCursoByIdService(id);
        //     const { statusCode, ...responseData } = cursoService;
        //     res.status(statusCode).json(responseData);
        // } else {
        //     // Si no es un número, se asume que es una búsqueda por slug
        //     const slug = req.params.params;
        //     const cursoService = await getCursoBySlugService(slug);
        //     const { statusCode, ...responseData } = cursoService;
        //     res.status(statusCode).json(responseData);
        // }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al obtener el curso buscado' });
    }
}

export const getCursosByCategoria = async(req, res) => {
    try {
        const cursosService = await getCursosByCategoriaService(req.query, req.params);
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al obtener los cursos por su categoria' });
    }
}

export const newCurso = async(req, res) => {
    try {
        const cursoService = await newCursoService(req.body, req.files, req.userId);
        const { statusCode, ...responseData } = cursoService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al crear el nuevo curso' });
    }
}

export const updateCurso = async(req, res) => {
    try {
        const cursoService = await updateCursoService(req.params, req.body, req.files, req.userId);
        const { statusCode, ...responseData } = cursoService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al actualizar el curso' });
    }
}

export const deleteCurso = async(req, res) => {
    try {
        const cursoService = await deleteCursoService(req.params);
        const { statusCode, ...responseData } = cursoService;
        res.status(statusCode).json(responseData)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al eliminar el curso' });
    }
}

export const restoreCurso = async(req, res) => {
    try {
        const cursoService = await restoreCursoService(req.params);
        const { statusCode, ...responseData } = cursoService;
        res.status(statusCode).json(responseData)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al restaurar el curso' });
    }
}