import { Router } from "express";
import { isAdmin, isLogged, isDocente, isDocenteOrAdmin } from "../middlewares/verifyUser.middleware.js";
import multiparty from 'connect-multiparty';
import { checkFolderCreate } from "../helpers/image.helpers.js";
import { changeEstadoUsuario, deleteUsuario, getUsuarioById, getUsuarioLogueado, getUsuarios, getUsuariosByRoleDocente, newUsuario, restoreUsuario, updateUsuario } from "../controllers/usuario.controller.js";
import { new_user, usuario_validator, usuario_validator_estado } from "../validations/usuario.validation.js";
import { checkDuplicateEmail, checkRolesExisted, checkValidEmail } from "../middlewares/register.middleware.js";
checkFolderCreate('usuarios');
const path = multiparty({ uploadDir: './uploads/usuarios', limit: '50mb' });
const router = Router();

router.get('/usuarios', [isLogged, isAdmin], getUsuarios);
router.get('/usuario/:id', [isLogged, isDocenteOrAdmin], getUsuarioById);
router.get('/me', [isLogged], getUsuarioLogueado);
router.get('/usuarios/docentes', [isLogged, isDocenteOrAdmin], getUsuariosByRoleDocente)
router.post('/usuario/nuevo', [checkDuplicateEmail,
    checkRolesExisted,
    checkValidEmail, isLogged, isAdmin, new_user
], newUsuario)
router.put('/usuario/:id/editar', [path, isLogged, usuario_validator], updateUsuario)
router.put('/usuario/:id/estado', [isLogged, usuario_validator_estado], changeEstadoUsuario)
router.delete('/usuario/:id/borrar', [isLogged], deleteUsuario)
router.post('/usuario/:id/restaurar', [isLogged], restoreUsuario)


export default router;