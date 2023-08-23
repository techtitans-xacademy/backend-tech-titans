import sequelize from "../config/database.config.js";
import Rol from '../models/rol.model.js';
import Usuario from '../models/usuario.model.js';
import { config } from "dotenv";
config();

const Op = sequelize.Sequelize.Op;


export const registerUserProvider = async(usuario, rolesServ) => {
    try {
        const user = await Usuario.create(usuario);
        let userRoles = [];

        if (rolesServ) {
            userRoles = await Rol.findAll({
                where: {
                    nombre: {
                        [Op.or]: rolesServ
                    }
                }
            });
        } else {
            // user role = 1
            const rol = await Rol.findByPk(3);
            userRoles.push(rol);
        }

        if (user) {
            await user.setRols(userRoles);
            return true
        } else {
            return false
        }
    } catch (err) {
        return err.message
    }
}

export const verifyUserProvider = async(token) => {
    try {
        return await Usuario.findOne({
            where: { token }
        });
    } catch (error) {
        return error.message;
    }
}

export const loginUserProvider = async(email) => {
    try {
        return await Usuario.findOne({
            where: { email }
        });
    } catch (error) {
        return error.message;
    }
}

export const forgotPasswordUserProvider = async(email) => {
    try {
        return await Usuario.findOne({
            where: { email },
        });
    } catch (error) {
        return error.message;
    }
}

export const recoveryPasswordUserProvider = async(token) => {
    try {
        return await Usuario.findOne({
            where: { token }
        });
    } catch (error) {
        return error.message;

    }
}

export const refreshTokenUserProvider = async(id) => {
    try {
        return await Usuario.findOne({
            where: {
                id
            }
        });
    } catch (error) {
        return error.message
    }
}

export const reactiveUserProvider = async(email) => {
    try {
        return await Usuario.findOne({
            where: { email },
        });
    } catch (error) {
        return error.message;
    }
}