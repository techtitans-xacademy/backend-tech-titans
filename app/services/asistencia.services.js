import { deleteAsistenciaProvider, enrollaCourseProvider, generateQRPagoProvider, getAsistenciaByIdProvider, getAsistenciasProvider, getCertificateWithAprobProvider, getCursosByEstudianteDetailProvider, getCursosByEstudianteProvider, restoreAsistenciaProvider, updateAsistenciaProvider } from "../providers/asistencia.providers.js";


export const getAsistenciasService = async(query) => {
    const { l, p, borrado = false } = query;

    const limit = parseInt(l) || parseInt(process.env.PAGE_SIZE);
    const page = parseInt(p) || 1;
    const deleteReg = Boolean(borrado);

    return await getAsistenciasProvider(limit, page, deleteReg);
}

export const getAsistenciaByIdService = async(params) => {
    const { id } = params;

    return await getAsistenciaByIdProvider(id);
}

export const getCursosByEstudianteService = async(userId) => {
    return await getCursosByEstudianteProvider(userId);
}

export const getCursosByEstudianteDetailService = async(params, userId) => {
    const { codigoInscripcion } = params;
    return await getCursosByEstudianteDetailProvider(codigoInscripcion, userId);
}

export const getCertificateWithAprobService = async(params) => {
    const { codigoInscripcion } = params;

    return await getCertificateWithAprobProvider(codigoInscripcion)
}

export const enrollaCourseService = async(params, userId) => {
    const { cursoSlug } = params;

    return await enrollaCourseProvider(cursoSlug, userId);
}

export const updateAsistenciaService = async(params, body) => {
    const { codigoInscripcion } = params;
    const { asistio, puntaje } = body

    let nota = 'No calificado';

    if (asistio) nota = puntaje;

    let asistenciaBody = {
        asistio,
        puntaje: nota
    }

    return await updateAsistenciaProvider(codigoInscripcion, asistenciaBody);
}

export const deleteAsistenciaService = async(params) => {
    const { id } = params;

    return await deleteAsistenciaProvider(id);
}

export const restoreAsistenciaService = async(params) => {
    const { id } = params;

    return await restoreAsistenciaProvider(id);
}

export const generateQRPagoService = async(params) => {
    const { code } = params;

    return await generateQRPagoProvider(code);
}