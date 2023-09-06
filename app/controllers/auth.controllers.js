import { forgotPasswordUserService, loginUserService, newPasswordUserService, reactiveUserService, recoveryPasswordUserService, refreshTokenUserService, registerUserService, verifyNewUserService, verifyUserService } from "../services/auth.services.js";

export const registerUser = async(req, res) => {
    try {
        const userService = await registerUserService(req.body);
        const { statusCode, ...responseData } = userService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function verifyUser(req, res) {
    try {
        const userService = await verifyUserService(req.params);
        const { statusCode, ...responseData } = userService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function loginUser(req, res) {
    try {
        const userService = await loginUserService(req.body);
        const { statusCode, ...rsp } = userService;
        res.status(statusCode).json(rsp);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function forgotPasswordUser(req, res) {
    try {
        const userService = await forgotPasswordUserService(req.body);
        const { statusCode, ...rsp } = userService;
        res.status(statusCode).json(rsp);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function recoveryPasswordUser(req, res) {
    try {
        const userService = await recoveryPasswordUserService(req.params, req.body);
        const { statusCode, ...rsp } = userService;
        res.status(statusCode).json(rsp);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function refreshTokenUser(req, res) {
    try {
        const userService = await refreshTokenUserService(req.body);
        const { statusCode, ...rsp } = userService;
        res.status(statusCode).json(rsp);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function reactiveUser(req, res) {
    try {
        const userService = await reactiveUserService(req.body);
        const { statusCode, ...rsp } = userService;
        res.status(statusCode).json(rsp);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function verifyNewUser(req, res) {
    try {
        const userService = await verifyNewUserService(req.params);
        const { statusCode, ...rsp } = userService;
        res.status(statusCode).json(rsp);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

export async function newPasswordUser(req, res) {
    try {
        const userService = await newPasswordUserService(req.params, req.body);
        const { statusCode, ...rsp } = userService;
        res.status(statusCode).json(rsp);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}