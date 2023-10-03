import { Router } from "express";
import { isAdmin, isDocenteOrAdmin, isEstudiante, isLogged } from "../middlewares/verifyUser.middleware.js";
import { deleteAsistencia, enrollaCourse, generateQRPago, getAsistenciaById, getAsistencias, getCertificateWithAprob, getCursosByEstudiante, getCursosByEstudianteDetail, restoreAsistencia, updateAsistencia } from "../controllers/asistencia.controller.js";

const router = Router();

router.get('/asistencias', [isLogged, isDocenteOrAdmin], getAsistencias);
router.get('/asistencia/:id', [isLogged, isDocenteOrAdmin], getAsistenciaById);
router.get('/asistencias/mis-cursos', isLogged, getCursosByEstudiante);
router.get('/asistencias/mis-cursos/:codigoInscripcion', isLogged, getCursosByEstudianteDetail);
router.get('/asistencias/mis-cursos/certificado/:codigoInscripcion', getCertificateWithAprob);
router.post('/asistencia/inscribirme/:cursoSlug', [isLogged], enrollaCourse);
router.put('/asistencia/marcar/:codigoInscripcion', [isLogged, isDocenteOrAdmin], updateAsistencia)
router.get('/asistencia/generar-qr/:code', [isLogged], generateQRPago)
router.delete('/asistencia/:id/eliminar', [isLogged, isDocenteOrAdmin], deleteAsistencia)
router.post('/asistencia/:id/restaurar', [isLogged, isDocenteOrAdmin], restoreAsistencia)

export default router;