import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoriaRoutes from "./categorias.routes.js";
import docenteRoutes from "./docentes.routes.js";
import cursoRoutes from "./curso.routes.js";
import usuarioRoutes from "./usuario.routes.js";
import asistenciaRoutes from "./asistencias.routes.js";
import pagoRoutes from "./pago.routes.js"

const router = Router();
router.get("/", (req, res) => {
    res.json({
        message: "Bienvenido al backend de Tech Titans."
    });
});

router.use("/auth", authRoutes);
router.use("/api", categoriaRoutes);
router.use("/api", docenteRoutes);
router.use("/api", cursoRoutes);
router.use("/api", usuarioRoutes);
router.use("/api", asistenciaRoutes);
router.use("/api", pagoRoutes);

export default router;