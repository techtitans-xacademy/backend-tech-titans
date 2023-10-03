import Asistencia from "../models/asistencia.model.js";
import Curso from "../models/curso.model.js";
import Usuario from "../models/usuario.model.js";
import Categoria from "../models/categoria.model.js";
import Pago from "../models/pago.model.js";
import { logger } from "../utils/winston.logger.js";
import { sendMail } from "../mails/config.mails.js";
import { Op } from "sequelize";
import { config } from "dotenv";
import { generateToken } from "../helpers/generateTokens.helpers.js";
import { formatDate, formatoDecimalAEntero, formatoFecha, formatoHora } from "../utils/formatData.js";
import { v4 as uuidv4 } from 'uuid';
config();

const front = process.env.HOST_FRONT_EMAIL;

export const getPagosProvider = async(limit, page, borrado) => {
    try {
        const whereCondition = {};

        if (borrado === true) {
            whereCondition.deletedAt = {
                [Op.ne]: null,
            };
        } else if (borrado === false) {
            whereCondition.deletedAt = null;
        }

        const size = await Pago.count({
            paranoid: false,
            where: whereCondition,
        });
        const totalPages = Math.ceil(size / limit);
        const offset = (page - 1) * limit;
        let nextPage = page + 1;
        let lastPage = page - 1;

        if (nextPage > totalPages) {
            nextPage = totalPages;
        }

        if (lastPage == 0) {
            lastPage = 1;
        }

        const pagos = await Pago.findAll({
            paranoid: false,
            where: whereCondition,
            limit,
            offset,
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "usuarioId", "inscripcionId"],
            },
            order: [
                ["createdAt", "DESC"]
            ],
            include: [{
                    model: Usuario,
                    attributes: ["id", "nombre", "apellido", "email"],
                },
                {
                    model: Asistencia,
                    as: 'inscripcion',
                    attributes: ["id", "codigoInscripcion", "asistio", "puntaje"],
                }
            ],
        });
        if (size > 0) {
            return {
                statusCode: 200,
                data: pagos,
                pagination: {
                    page,
                    limit,
                    total: size,
                    totalPages,
                    lastPage,
                    nextPage,
                },
            };
        } else {
            return {
                statusCode: 200,
                data: [],
            };
        }
    } catch (error) {
        console.error("No se pudieron obtener los pagos:", error.message);
        logger.error("No se pudieron obtener los pagos:", error.message);
        return { statusCode: 500, mensaje: "No se pudieron obtener las pagos de las inscripciones" };
    }
}

export const getPagoByIdProvider = async(id) => {
    try {
        const pago = await Pago.findAll({
            paranoid: false,
            where: { id },
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "usuarioId", "inscripcionId"],
            },
            order: [
                ["createdAt", "DESC"]
            ],
            include: [{
                    model: Usuario,
                    attributes: ["id", "nombre", "apellido", "email"],
                },
                {
                    model: Asistencia,
                    as: 'inscripcion',
                    attributes: ["id", "codigoInscripcion", "asistio", "puntaje"],
                }
            ],
        });

        if (pago.length > 0) {
            return {
                statusCode: 200,
                data: pago
            }
        } else {
            return {
                statusCode: 404,
                mensaje: "No se encontro ningun pago con el id buscado"
            }
        }
    } catch (error) {
        console.error("No se pudo obtener el pago:", error.message);
        logger.error("No se pudo obtener el pago:", error.message);
        return { statusCode: 500, mensaje: "No se pudo obtener el pago de la inscripcion buscada por id" };
    }
}

export const searchPagoByCodeProvider = async(tokenPago) => {
    try {
        const pago = await Pago.findAll({
            paranoid: false,
            where: { tokenPago },
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "usuarioId", "inscripcionId"],
            },
            order: [
                ["createdAt", "DESC"]
            ],
            include: [{
                    model: Usuario,
                    attributes: ["id", "nombre", "apellido", "email"],
                },
                {
                    model: Asistencia,
                    as: 'inscripcion',
                    attributes: ["id", "codigoInscripcion", "asistio", "puntaje"],
                }
            ],
        });
        if (pago.length > 0) {
            return {
                statusCode: 200,
                data: pago
            }
        } else {
            return {
                statusCode: 404,
                mensaje: "No se encontro ningun pago con el codigo buscado"
            }
        }
    } catch (error) {
        console.error("No se pudo obtener el pago:", error.message);
        logger.error("No se pudo obtener el pago:", error.message);
        return { statusCode: 500, mensaje: "No se pudo obtener el pago de la inscripcion buscada por token" };
    }
}

export const updatePagoProvider = async(tokenPago, dataPago) => {
    try {
        const pagoData = await Pago.findOne({ where: { tokenPago } })
        if (!pagoData) {
            return {
                statusCode: 404,
                mensaje: "No se encontro ningun pago con el codigo buscado"
            }
        }
        const asistencia = await Asistencia.findOne({ where: { id: pagoData.inscripcionId } });
        const curso = await Curso.findOne({ where: { id: asistencia.cursoId } });
        const usuario = await Usuario.findOne({ where: { id: asistencia.estudianteId } })
        const pago = await Pago.update(dataPago, { where: { tokenPago } })
        if (pago) {
            if (dataPago.pago) {
                let bodyMail = {
                    nombre: `${usuario.nombre} ${usuario.apellido}`,
                    cursoNombre: curso.nombre,
                    dia: formatoFecha(curso.dia_curso),
                    hora: formatoHora(curso.hora_curso),
                    link: `${front}/cursos/${curso.slug}`,
                    micuenta: `${front}/perfil/mis-cursos`,
                    infocurso: `${front}/perfil/curso/${asistencia.codigoInscripcion}`,
                    year: new Date().getFullYear()
                }
                sendMail(usuario.email, `Gracias tu pago para el curso ${curso.nombre} fue aprobado.`, 'confirm_pago', bodyMail)
            }
            return {
                statusCode: 200,
                mensaje: 'Has confirmado el pago de la inscripción con éxito.'
            }
        } else {
            return {
                statusCode: 400,
                mensaje: "No se pudo pagar el curso"
            }
        }
    } catch (error) {
        console.error("No se pudo actualizar el pago:", error.message);
        logger.error("No se pudo actualizar el pago:", error.message);
        return { statusCode: 500, mensaje: "No se pudo actualizar el pago de la inscripcion al curso. Contacta con un administrador" };
    }
}

export const deletePagoProvider = async(id) => {
    try {
        const response = await Pago.destroy({ where: { id } });
        if (response) {
            logger.info(`¡Pago eliminado exitosamente!`);
            return { statusCode: 200, mensaje: "¡Pago eliminado exitosamente!" };
        } else {
            logger.info(`No se pudo eliminar el pago`);
            return { statusCode: 400, mensaje: "No se pudo eliminar el pago" };
        }
    } catch (error) {
        console.error("No se pudo eliminar el pago:", error.message);
        logger.error("No se pudo eliminar el pago:", error.message);
        return { statusCode: 500, mensaje: "No se pudo eliminar el pago de la inscripcion al curso. Contacta con un administrador" };
    }
}

export const restorePagoProvider = async(id) => {
    try {
        const response = await Pago.restore({ where: { id } });
        if (response) {
            logger.info(`¡Pago restaurado exitosamente!`);
            return { statusCode: 200, mensaje: "¡Pago restaurado exitosamente!" };
        } else {
            logger.info(`No se pudo restaurar el pago`);
            return { statusCode: 400, mensaje: "No se pudo restaurar el pago" };
        }
    } catch (error) {
        console.error("No se pudo restaurar el pago:", error.message);
        logger.error("No se pudo restaurar el pago:", error.message);
        return { statusCode: 500, mensaje: "No se pudo restaurar el pago de la inscripcion al curso. Contacta con un administrador" };
    }
}