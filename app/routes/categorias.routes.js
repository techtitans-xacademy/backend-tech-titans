import { Router } from "express";
import { isAdmin, isLogged } from "../middlewares/verifyUser.middleware.js";
import { deleteCategoria, getCategorias, getCategoriasPorIdOrSlug, newCategoria, restoreCategoria, updateCategoria } from "../controllers/categoria.controller.js";
import { nueva_cat, update_cat } from "../validations/categoria.validation.js";

const router = Router();

router.get("/categorias", getCategorias);
router.get("/categoria/:params", getCategoriasPorIdOrSlug);
router.post("/categoria/nuevo", nueva_cat, [isLogged, isAdmin], newCategoria);
router.put("/categoria/:id/editar", update_cat, [isLogged, isAdmin], updateCategoria);
router.delete("/categoria/:id/borrar", [isLogged, isAdmin], deleteCategoria);
router.post("/categoria/:id/restaurar", [isLogged, isAdmin], restoreCategoria);

export default router;