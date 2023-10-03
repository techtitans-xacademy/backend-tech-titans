import { Router } from "express";
import { isAdmin, isLogged, isDocente, isDocenteOrAdmin } from "../middlewares/verifyUser.middleware.js";
import multiparty from 'connect-multiparty';
import { checkFolderCreate } from "../helpers/image.helpers.js";
import { deleteCurso, getCursoByIdOrSlug, getCursos, getCursosByCategoria, getCursosByUserLogged, newCurso, restoreCurso, updateCurso } from "../controllers/curso.controllers.js";
import { curso_validate } from "../validations/curso.validations.js";
checkFolderCreate('cursos');
const path = multiparty({ uploadDir: './uploads/cursos', limit: '50mb' });

const router = Router();

router.get('/cursos', getCursos);
router.get('/cursos/all', isLogged, getCursosByUserLogged);
router.get('/curso/:params', getCursoByIdOrSlug);
router.get('/cursos/categoria/:slug', getCursosByCategoria);
router.post('/curso/nuevo', [path, isLogged, isDocenteOrAdmin, curso_validate], newCurso)
router.put('/curso/:id/editar', [path, isLogged, isAdmin, curso_validate], updateCurso)
router.delete('/curso/:id/borrar', [isLogged, isAdmin], deleteCurso)
router.post('/curso/:id/restaurar', [isLogged, isAdmin], restoreCurso)

export default router;