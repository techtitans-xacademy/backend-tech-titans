import { deleteDocenteService, getDocentePorIdService, getDocentesService, newDocenteService, restoreDocenteService, updateDocenteService } from "../services/docente.services.js";

export async function getDocentes(req, res) {
    try {
        const data = await getDocentesService(req.query);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function getDocentePorId(req, res) {
    try {
        const data = await getDocentePorIdService(req.params);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function newDocente(req, res) {
    try {
        const data = await newDocenteService(req.body, req.userId, req.files);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function updateDocente(req, res) {
    try {
        const data = await updateDocenteService(req.params, req.body, req.userId, req.files);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function deleteDocente(req, res) {
    try {
        const data = await deleteDocenteService(req.params);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function restoreDocente(req, res) {
    try {
        const data = await restoreDocenteService(req.params);
        const { statusCode, ...bodyData } = data;
        res.status(statusCode).json(bodyData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}