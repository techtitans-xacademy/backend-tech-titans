import { Router } from "express";

const router = Router();
router.get("/", (req, res) => {
    res.json({
        message: "Bienvenido al backend de Tech Titans."
    });
});

export default router;