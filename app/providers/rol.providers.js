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
        let arrayRoles = [];
        let arrayRolesQ = [];

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return { statusCode: 404, mensaje: 'Usuario no encontrado' };
        }

        if (userId === id) return { statusCode: 400, mensaje: 'No tienes permiso para eliminar el rol a tu propio usuario' }

        const rolesActuales = await usuario.getRols();

        const rolesAgregar = roles.filter(role => !rolesActuales.some(rolActual => rolActual.nombre === role));

        const rolesQuitar = rolesActuales.filter(rolActual => !roles.includes(rolActual.nombre));

        rolesActuales.forEach(rol => {
            arrayRoles.push(rol);
        })
        rolesQuitar.forEach(rol => {
            if (rol.nombre === 'estudiante') return;
            arrayRolesQ.push(rol);
        });

        if (rolesAgregar.length > 0) {
            const rolesAAgregar = await Rol.findAll({ where: { nombre: rolesAgregar } });
            rolesAAgregar.forEach(role => arrayRoles.push(role))
            await usuario.setRols(arrayRoles);
            console.log(`Se agregaron roles al usuario ${usuario.email}`);
            return { statusCode: 200, mensaje: `Se agregaron roles al usuario ${usuario.email}` }
        } else {
            if (arrayRolesQ.length > 0) {
                await usuario.removeRols(arrayRolesQ);
                console.log(`Se eliminaron los roles de usuario ${usuario.email}`);
                return { statusCode: 200, mensaje: `Se eliminaron los roles de usuario para esta cuenta: ${usuario.email}` }
            } else {
                return { statusCode: 403, mensaje: 'No está permitido eliminar el rol de estudiante.' };
            }
        }

    } catch (error) {
        console.error('No se pudieron agregar o quitar roles:', error.message);
        logger.error('No se pudieron agregar o quitar roles:', error.message);
        return { statusCode: 500, mensaje: 'No se pudieron agregar o quitar roles' };
    }
}