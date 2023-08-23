import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();
router.get("/", (req, res) => {
    res.json({
        message: "Bienvenido al backend de Tech Titans."
    });
});

router.use("/auth", authRoutes);

export default router;