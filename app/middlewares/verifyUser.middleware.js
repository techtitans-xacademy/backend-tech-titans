import Jwt from "jsonwebtoken";
import Usuario from '../models/usuario.model.js';
import moment from 'moment';

const secret = process.env.JWT_SECRET || "";

export function isLogged(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) return res.status(403).send({ mensaje: `No has enviado un token` });

    let token = authorization.replace(/['"]+/g, '');

    let seg = token.split('.');

    if (seg.length != 3) {
        return res.status(403).send({ mensaje: 'Token no valido' });
    } else {
        try {
            const payload = Jwt.decode(token, secret);
            if (payload.exp <= moment().unix()) {
                return res.status(403).send({ mensaje: 'Token expirado' });
            }
        } catch (error) {
            return res.status(403).send({ mensaje: 'Token no valido' });
        }
    }

    Jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                mensaje: "No autorizado!"
            });
        }
        req.userId = decoded.id;
        req.email = decoded.email;
        isVerifiedOrActived(req, res, next);
    });
};

function isVerifiedOrActived(req, res, next) {
    Usuario.findByPk(req.userId).then(user => {
        if (user.email_verified_at === null) {
            return res.status(401).send({
                mensaje: "No has verificado tu cuenta. Por favor verifique su cuenta, verifique si tiene el correo electrónico en su casilla"
            });
        }
        if (user.status === false) {
            return res.status(401).send({
                mensaje: "La cuenta no está activa, comuníquese con el administrador del sistema."
            });
        }
        next();
    });
}

export function isAdmin(req, res, next) {
    Usuario.findByPk(req.userId).then(user => {
        user.getRols().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].nombre === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                mensaje: "¡Requiere rol de administrador!"
            });
            return;
        });
    });
};

export function isDocente(req, res, next) {
    Usuario.findByPk(req.userId).then(user => {
        user.getRols().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].nombre === "docente") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                mensaje: "¡Requiere rol de docente!"
            });
        });
    });
};

export function isEstudiante(req, res, next) {
    Usuario.findByPk(req.userId).then(user => {
        user.getRols().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].nombre === "estudiante") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                mensaje: "¡Requiere rol de estudiante!"
            });
        });
    });
};

export function isDocenteOrAdmin(req, res, next) {
    Usuario.findByPk(req.userId).then(user => {
        user.getRols().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].nombre === "docente") {
                    next();
                    return;
                }

                if (roles[i].nombre === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                mensaje: "¡Requiere rol de docente o administrador!"
            });
        });
    });
};