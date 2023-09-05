import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoriaRoutes from "./categorias.routes.js";

const router = Router();
router.get("/", (req, res) => {
    res.json({
        message: "Bienvenido al backend de Tech Titans."
    });
});

router.use("/auth", authRoutes);
router.use("/api", categoriaRoutes);

export default router;