import { Router } from "express";
import { isAdmin, isLogged } from "../middlewares/verifyUser.middleware.js";
import { deleteDocente, getDocentePorId, getDocentes, newDocente, restoreDocente, updateDocente } from "../controllers/docente.controllers.js";
import { docente_validation } from "../validations/docente.validations.js";
import multiparty from 'connect-multiparty';
import { checkFolderCreate } from "../helpers/image.helpers.js";
checkFolderCreate('docente');
const path = multiparty({ uploadDir: './uploads/docente', limit: '50mb' });

const router = Router();

router.get('/docentes', getDocentes)
router.get('/docente/:id', getDocentePorId)
router.post('/docente/nuevo', [path, isLogged, isAdmin, docente_validation], newDocente)
router.put('/docente/:id/editar', [path, isLogged, isAdmin, docente_validation], updateDocente)
router.delete('/docente/:id/borrar', [isLogged, isAdmin], deleteDocente)
router.post('/docente/:id/restaurar', [isLogged, isAdmin], restoreDocente)


export default router;