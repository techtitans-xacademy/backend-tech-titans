import Rol from "../models/rol.model.js";
import Usuario from "../models/usuario.model.js";
import { logger } from "../utils/winston.logger.js";

export const getRolesProvider = async() => {
    try {
        const roles = await Rol.findAll({
            order: [
                ["nombre", "ASC"]
            ]
        });
        return {
            statusCode: 200,
            data: roles
        }
    } catch (error) {
        console.error('No se pudieron obtener roles:', error.message);
        logger.error('No se pudieron obtener roles:', error.message);
        return { statusCode: 500, mensaje: 'No se pudieron obtener roles' };
    }
}

export const gestionarRolesDeUsuarioProvider = async(id, roles, userId) => {
    try {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return { statusCode: 400, mensaje: 'Usuario no encontrado' }
        }

        if (userId === id) return { statusCode: 400, mensaje: 'No tienes permiso para cambiar el rol a tu propio usuario' }

        const rolesActuales = await usuario.getRols();

        const nuevosRolesSet = new Set();
        for (const rol of roles) {
            const rolUser = await Rol.findOne({ where: { nombre: rol } });

            if (rolUser) {
                nuevosRolesSet.add(rolUser);
            }
        }

        await usuario.removeRols([...rolesActuales]);

        await usuario.setRols([...nuevosRolesSet]);

        return {
            statusCode: 200,
            mensaje: 'Se le ha actualizado con éxito los roles al usuario'
        }

    } catch (error) {
        console.error('No se pudieron agregar o quitar roles:', error.message);
        logger.error('No se pudieron agregar o quitar roles:', error.message);
        return { statusCode: 500, mensaje: 'No se pudieron agregar o quitar roles' };
    }
}