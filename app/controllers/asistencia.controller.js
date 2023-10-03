import { deleteAsistenciaService, enrollaCourseService, generateQRPagoService, getAsistenciaByIdService, getAsistenciasService, getCertificateWithAprobService, getCursosByEstudianteDetailService, getCursosByEstudianteService, restoreAsistenciaService, updateAsistenciaService } from "../services/asistencia.services.js";
import { logger } from "../utils/winston.logger.js";
import * as fs from 'fs';
import path from "path";

export const getAsistencias = async(req, res) => {
    try {
        const cursosService = await getAsistenciasService(req.query);
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(`Error en el controller: ${error.message}`);
        logger.error(`Error en el controller: ${error.message}`);
        res.status(500).json({ mensaje: 'Error al obtener los asistentes a los cursos' });
    }
};

export const getAsistenciaById = async(req, res) => {
    try {
        const cursosService = await getAsistenciaByIdService(req.params);
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(`Error en el controller: ${error.message}`);
        logger.error(`Error en el controller: ${error.message}`);
        res.status(500).json({ mensaje: 'Error al obtener los asistentes a los cursos' });
    }
};

export const getCursosByEstudiante = async(req, res) => {
    try {
        const cursosService = await getCursosByEstudianteService(req.userId);
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(`Error en el controller: ${error.message}`);
        logger.error(`Error en el controller: ${error.message}`);
        res.status(500).json({ mensaje: 'Error al obtener los asistentes a los cursos' });
    }
};

export const getCursosByEstudianteDetail = async(req, res) => {
    try {
        const cursosService = await getCursosByEstudianteDetailService(req.params, req.userId);
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(`Error en el controller: ${error.message}`);
        logger.error(`Error en el controller: ${error.message}`);
        res.status(500).json({ mensaje: 'Error al obtener los asistentes a los cursos' });
    }
};

export const getCertificateWithAprob = async(req, res) => {
    try {
        const pdfPath = await getCertificateWithAprobService(req.params);
        if (pdfPath !== null) {
            const pdfSplit = path.normalize(pdfPath).split(path.sep);

            // Configura la respuesta HTTP para descargar el PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${pdfSplit[2]}"`);

            const pdfBytes = fs.readFileSync(pdfPath);

            res.status(200).send(pdfBytes);

            // Elimina el archivo PDF del servidor después de ser enviado
            fs.unlinkSync(pdfPath);
        } else {
            res.status(400).json({ mensaje: 'No has aprobado el curso' })
        }
    } catch (error) {
        console.log(`Error en el controller: ${error.message}`);
        logger.error(`Error en el controller: ${error.message}`);
        res.status(500).json({ mensaje: 'Error al descargar el certificado del curso' });
    }
}

export const generateQRPago = async(req, res) => {
    try {
        const qrImg = await generateQRPagoService(req.params);

        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(Buffer.from(qrImg.split('base64,')[1], 'base64'));
    } catch (error) {
        console.log(`Error en el controller: ${error.message}`);
        logger.error(`Error en el controller: ${error.message}`);
        res.status(500).json({ mensaje: 'Error al generar el qr del pago' });
    }
}

export const enrollaCourse = async(req, res) => {
    try {
        const cursosService = await enrollaCourseService(req.params, req.userId);
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(`Error en el controller: ${error.message}`);
        logger.error(`Error en el controller: ${error.message}`);
        res.status(500).json({ mensaje: 'Error al inscribirte al curso' });
    }
};

export const updateAsistencia = async(req, res) => {
    try {
        const cursosService = await updateAsistenciaService(req.params, req.body);
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(`Error en el controller: ${error.message}`);
        logger.error(`Error en el controller: ${error.message}`);
        res.status(500).json({ mensaje: 'Error al actualizar la asistencia al curso' });
    }
};

export const deleteAsistencia = async(req, res) => {
    try {
        const cursosService = await deleteAsistenciaService(req.params);
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(`Error en el controller: ${error.message}`);
        logger.error(`Error en el controller: ${error.message}`);
        res.status(500).json({ mensaje: 'Error al eliminar la inscripcion al curso' });
    }
};

export const restoreAsistencia = async(req, res) => {
    try {
        const cursosService = await restoreAsistenciaService(req.params);
        const { statusCode, ...responseData } = cursosService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(`Error en el controller: ${error.message}`);
        logger.error(`Error en el controller: ${error.message}`);
        res.status(500).json({ mensaje: 'Error al restaurar la inscripcion al curso' });
    }
};