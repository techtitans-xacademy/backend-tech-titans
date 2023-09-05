import Rol from '../models/rol.model.js';
import Usuario from '../models/usuario.model.js';
import blacklist from '../utils/blacklist-emails.js';
import { logger } from "../utils/winston.logger.js";
import EmailValidation from "emailvalid";

export function checkValidEmail(req, res, next) {
    const { email } = req.body;

    const ev = new EmailValidation({
        allowFreemail: true,
        allowDisposable: false,
        blacklist
    })

    const result = ev.check(email)

    if (!result.valid) {
        logger.error('El email con el que se quiere registrar esta en una lista negra.')
        return res.status(400).json({
            "mensaje": "No es un email válido o no está permitido"
        })
    }

    next();
}

export function checkDuplicateEmail(req, res, next) {
    const { email } = req.body;
    // Email
    Usuario.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Upps... ¡El correo electrónico ya está en uso!"
            });
            logger.error(`Upps... El correo electrónico (${user.email}) ya está en uso`)
            return;
        }

        next();
    });
};

export async function checkRolesExisted(req, res, next) {
    try {
        const { roles } = req.body;
        if (roles === undefined) {
            next();
            return;
        }

        const existingRoles = await Rol.findAll({
            where: {
                nombre: roles,
            },
        });

        const existingRoleNames = existingRoles.map(role => role.dataValues.nombre);

        const rolesNotFound = roles.filter(role => !existingRoleNames.includes(role));

        if (rolesNotFound.length > 0) {
            return res.status(400).send({
                message: "Upps...! Los roles no existen: " + rolesNotFound.join(", "),
            });
        }

        // TODO: All roles exist in the database
        // Take any additional action if necessary
        next();
    } catch (error) {
        logger.error('No se pudieron verificar los roles: ', error);
        res.status(500).send({
            message: "No se pudieron verificar los roles",
        });
    }
}