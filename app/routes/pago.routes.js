import { Router } from "express";
import { isAdmin, isLogged, isDocente, isDocenteOrAdmin } from "../middlewares/verifyUser.middleware.js";
import { deletePago, getPagoByIdOrToken, getPagos, restorePago, updatePago } from "../controllers/pago.controller.js";

const router = Router();

router.get('/pagos', [isLogged, isDocenteOrAdmin], getPagos)
router.get('/pago/:params', [isLogged, isDocenteOrAdmin], getPagoByIdOrToken);
router.put('/pago/cobrar/inscripcion/:tokenPago', [isLogged, isDocenteOrAdmin], updatePago)
router.delete('/pago/:id/eliminar', [isLogged, isDocenteOrAdmin], deletePago)
router.post('/pago/:id/restaurar', [isLogged, isDocenteOrAdmin], restorePago)

export default router;