import Asistencia from "../models/asistencia.model.js";
import Curso from "../models/curso.model.js";
import Usuario from "../models/usuario.model.js";
import Categoria from "../models/categoria.model.js";
import Pago from "../models/pago.model.js";
import { logger } from "../utils/winston.logger.js";
import { sendMail } from "../mails/config.mails.js";
import { Op } from "sequelize";
import { config } from "dotenv";
import { generateTokenPago } from "../helpers/generateTokens.helpers.js";
import { formatDate, formatoDecimalAEntero, formatoFecha, formatoHora, formatoMes, formatoMes2 } from "../utils/formatData.js";
import { v4 as uuidv4 } from 'uuid';
import { checkFolderCreate } from "../helpers/image.helpers.js";
import { generateCertificate } from "../helpers/generateCertificate.helpers.js";
import qr from 'qrcode';
config();
checkFolderCreate('certificados');



const front = process.env.HOST_FRONT_EMAIL;

export const getAsistenciasProvider = async(limit, page, borrado) => {
    try {
        const whereCondition = {};

        if (borrado === true) {
            whereCondition.deletedAt = {
                [Op.ne]: null,
            };
        } else if (borrado === false) {
            whereCondition.deletedAt = null;
        }

        const size = await Asistencia.count({
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

        const asistencias = await Asistencia.findAll({
            paranoid: false,
            where: whereCondition,
            limit,
            offset,
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "cursoId", "estudianteId", "docenteId"],
            },
            order: [
                ["createdAt", "DESC"]
            ],
            include: [{
                    model: Curso,
                    as: 'curso',
                    // attributes: ["nombre", "descripcion", "portada", "dia_curso", "hora_curso", "duracion", "precio", "slug", "categoria", "usuario", "docente"],
                    attributes: {
                        exclude: ["deletedAt", "createdAt", "updatedAt", "usuarioId", "categoriaId", 'docenteId', 'public_id'],
                    },
                    include: [{
                            model: Categoria,
                            as: 'categoria',
                            attributes: ["id", "nombre"],
                        }, {
                            model: Usuario,
                            as: "usuario",
                            attributes: ["id", "nombre", "apellido", "email"],
                        },
                        {
                            model: Usuario,
                            as: 'docente',
                            attributes: ["id", "nombre", "apellido", "email"],
                        }
                    ],
                }, {
                    model: Usuario,
                    as: "estudiante",
                    attributes: ["id", "nombre", "apellido", "email"],
                },
                {
                    model: Usuario,
                    as: 'docente',
                    attributes: ["id", "nombre", "apellido", "email"],
                },
                {
                    model: Pago,
                    as: "pago",
                    attributes: ["id", "tokenPago", "fechaPago", "pago"],
                }
            ],
        });
        if (size > 0) {
            return {
                statusCode: 200,
                data: asistencias,
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
        console.error("No se pudieron obtener los cursos:", error.message);
        logger.error("No se pudieron obtener los cursos:", error.message);
        return { statusCode: 500, mensaje: "No se pudieron obtener las asistencias de los cursos" };
    }
}

export const getAsistenciaByIdProvider = async(id) => {
    try {
        const asistencia = await Asistencia.findAll({
            paranoid: true,
            where: { id },
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "cursoId", "estudianteId", "docenteId"],
            },
            order: [
                ["createdAt", "DESC"]
            ],
            include: [{
                    model: Curso,
                    as: 'curso',
                    attributes: {
                        exclude: ["deletedAt", "createdAt", "updatedAt", "usuarioId", "categoriaId", 'docenteId', 'public_id'],
                    },
                    include: [{
                            model: Categoria,
                            as: 'categoria',
                            attributes: ["id", "nombre"],
                        }, {
                            model: Usuario,
                            as: "usuario",
                            attributes: ["id", "nombre", "apellido", "email"],
                        },
                        {
                            model: Usuario,
                            as: 'docente',
                            attributes: ["id", "nombre", "apellido", "email"],
                        }
                    ],
                }, {
                    model: Usuario,
                    as: "estudiante",
                    attributes: ["id", "nombre", "apellido", "email"],
                },
                {
                    model: Usuario,
                    as: 'docente',
                    attributes: ["id", "nombre", "apellido", "email"],
                },
                {
                    model: Pago,
                    as: "pago",
                    attributes: ["id", "tokenPago", "fechaPago", "pago"],
                }
            ],
        });
        if (asistencia != null) {
            return {
                statusCode: 200,
                data: asistencia
            }
        } else {
            return {
                statusCode: 200,
                mensaje: "No se encontro ninguna asistencia con el id buscado"
            };
        }
    } catch (error) {
        console.error("No se pudieron obtener el curso buscado:", error.message);
        logger.error("No se pudieron obtener el curso buscado:", error.message);
        return { statusCode: 500, mensaje: "No se pudieron obtener las asistencias de el curso buscado" };
    }
}

export const getCursosByEstudianteProvider = async(userId) => {
    try {
        const asistencia = await Asistencia.findAll({
            paranoid: true,
            where: { estudianteId: userId },
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "cursoId", "estudianteId", "docenteId"],
            },
            order: [
                ["createdAt", "DESC"]
            ],
            include: [{
                    model: Curso,
                    as: 'curso',
                    attributes: {
                        exclude: ["deletedAt", "createdAt", "updatedAt", "usuarioId", "categoriaId", 'docenteId', 'public_id'],
                    },
                    include: [{
                            model: Categoria,
                            as: 'categoria',
                            attributes: ["id", "nombre"],
                        }, {
                            model: Usuario,
                            as: "usuario",
                            attributes: ["id", "nombre", "apellido", "email"],
                        },
                        {
                            model: Usuario,
                            as: 'docente',
                            attributes: ["id", "nombre", "apellido", "email"],
                        }
                    ],
                }, {
                    model: Usuario,
                    as: "estudiante",
                    attributes: ["id", "nombre", "apellido", "email"],
                },
                {
                    model: Usuario,
                    as: 'docente',
                    attributes: ["id", "nombre", "apellido", "email"],
                },
                {
                    model: Pago,
                    as: "pago",
                    attributes: ["id", "tokenPago", "fechaPago", "pago"],
                }
            ],
        });
        if (asistencia != null) {
            return {
                statusCode: 200,
                data: asistencia
            }
        } else {
            return {
                statusCode: 200,
                mensaje: "No se encontro ninguna asistencia con el id buscado"
            };
        }
    } catch (error) {
        console.error("No se pudieron obtener el curso buscado:", error.message);
        logger.error("No se pudieron obtener el curso buscado:", error.message);
        return { statusCode: 500, mensaje: "No se pudieron obtener las asistencias de el curso buscado" };
    }
}

export const getCursosByEstudianteDetailProvider = async(codigoInscripcion, userId) => {
    try {
        const asistencia = await Asistencia.findOne({
            paranoid: true,
            where: { codigoInscripcion, estudianteId: userId },
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "cursoId", "estudianteId", "docenteId"],
            },
            order: [
                ["createdAt", "DESC"]
            ],
            include: [{
                    model: Curso,
                    as: 'curso',
                    attributes: {
                        exclude: ["deletedAt", "createdAt", "updatedAt", "usuarioId", "categoriaId", 'docenteId', 'public_id'],
                    },
                    include: [{
                            model: Categoria,
                            as: 'categoria',
                            attributes: ["id", "nombre"],
                        }, {
                            model: Usuario,
                            as: "usuario",
                            attributes: ["id", "nombre", "apellido", "email"],
                        },
                        {
                            model: Usuario,
                            as: 'docente',
                            attributes: ["id", "nombre", "apellido", "email"],
                        }
                    ],
                }, {
                    model: Usuario,
                    as: "estudiante",
                    attributes: ["id", "nombre", "apellido", "email"],
                },
                {
                    model: Usuario,
                    as: 'docente',
                    attributes: ["id", "nombre", "apellido", "email"],
                },
                {
                    model: Pago,
                    as: "pago",
                    attributes: ["id", "tokenPago", "fechaPago", "pago"],
                }
            ],
        });
        if (asistencia != null) {
            return {
                statusCode: 200,
                data: asistencia
            }
        } else {
            return {
                statusCode: 200,
                mensaje: "No se encontro ninguna asistencia con el id buscado"
            };
        }
    } catch (error) {
        console.error("No se pudieron obtener el curso buscado:", error.message);
        logger.error("No se pudieron obtener el curso buscado:", error.message);
        return { statusCode: 500, mensaje: "No se pudieron obtener las asistencias de el curso buscado" };
    }
}

export const getCertificateWithAprobProvider = async(codigoInscripcion) => {
    try {
        const inscripcion = await Asistencia.findOne({ where: { codigoInscripcion } })
        const curso = await Curso.findOne({ where: { id: inscripcion.cursoId } });
        const usuario = await Usuario.findOne({ where: { id: inscripcion.estudianteId } })
        const pago = await Pago.findOne({ where: { inscripcionId: inscripcion.id } })
        if (pago.pago && inscripcion.asistio) {
            switch (inscripcion.puntaje) {
                case 'Aprobado':
                    return await generateCertificate(`${usuario.nombre} ${usuario.apellido}`, curso.nombre, formatoFecha(curso.dia_curso), formatoHora(curso.hora_curso), curso.duracion, formatoMes2(curso.dia_curso), curso.lugar);
                case 'Desaprobado':
                    return null;
                case 'No calificado':
                    return null;
                default:
                    return null;
            }
        }
    } catch (error) {
        console.error("No se pudo descargar el certificado del alumno:", error.message);
        logger.error("No se pudo descargar el certificado del alumno:", error.message);
        return { statusCode: 500, mensaje: "Ups... Hubo un error al descargar el certificado, contacta con un administrador!" };
    }
}

export const enrollaCourseProvider = async(cursoSlug, userId) => {
    try {
        const curso = await Curso.findOne({ where: { slug: cursoSlug } })
        const usuario = await Usuario.findByPk(userId);

        if (!curso) {
            return {
                statusCode: 404,
                mensaje: 'No se ha encontrado el curso que estas buscando'
            }
        }

        if (!usuario) {
            return {
                statusCode: 404,
                mensaje: 'No se ha encontrado el alumno que estas buscando'
            }
        }

        const fechaActual = new Date();

        if (curso.dia_curso <= formatDate(fechaActual)) {
            logger.error(`¡El alumno ${usuario.nombre} ${usuario.apellido} quizo inscribirse en un curso que ya fue dictado dias atras (${curso.dia_curso})!`);
            console.log(`¡El alumno ${usuario.nombre} ${usuario.apellido} quizo inscribirse en un curso que ya fue dictado dias atras (${curso.dia_curso})!`);
            return {
                statusCode: 400,
                mensaje: 'Este curso ya no está disponible porque ya se dictó. Revisa los cursos disponibles'
            }
        }

        const existingInscription = await Asistencia.findOne({
            where: {
                cursoId: curso.id,
                estudianteId: usuario.id
            }
        });

        if (existingInscription) {
            logger.error(`¡El alumno ${usuario.nombre} ${usuario.apellido} quizo inscribirse en un curso que ya se inscribió dias atras (${curso.dia_curso})!`);
            console.log(`¡El alumno ${usuario.nombre} ${usuario.apellido} quizo inscribirse en un curso que ya se inscribió dias atras (${curso.dia_curso})!`);
            return {
                statusCode: 400,
                mensaje: 'Ya estás inscrito en este curso, prueba en otro curso'
            }
        }

        let data = {
            asistio: false,
            puntaje: "No calificado",
            codigoInscripcion: uuidv4(),
            cursoId: curso.id,
            estudianteId: usuario.id,
            docenteId: curso.docenteId
        }

        const enrollCourse = await Asistencia.create(data);

        if (enrollCourse) {
            let tokenPago = generateTokenPago(10).toUpperCase();
            let dataPago = {
                tokenPago,
                pago: false,
                inscripcionId: enrollCourse.id,
                usuarioId: usuario.id
            }

            await Pago.create(dataPago);

            let bodyMail = {
                nombre: `${usuario.nombre} ${usuario.apellido}`,
                cursoNombre: curso.nombre,
                dia: formatoFecha(curso.dia_curso),
                hora: formatoHora(curso.hora_curso),
                costo: formatoDecimalAEntero(curso.precio),
                code: tokenPago,
                link: `${front}/cursos/${curso.slug}`,
                micuenta: `${front}/usuario/mis-cursos`,
                genQR: `${front}/usuario/mis-cursos/inscripcion/${enrollCourse.codigoInscripcion}`,
                year: new Date().getFullYear()
            }

            await sendMail(usuario.email, `${usuario.nombre} te has inscripto con éxito al curso: ${curso.nombre}`, 'inscripcion_ok', bodyMail);

            console.log(`¡El alumno ${usuario.nombre} ${usuario.apellido} se ha inscripto exitosamente al curso ${curso.nombre}!`);
            logger.info(`¡El alumno ${usuario.nombre} ${usuario.apellido} se ha inscripto exitosamente al curso ${curso.nombre}!`);
            return { statusCode: 201, mensaje: `Te has inscripto con éxito al curso ${curso.nombre}! Por favor sigue las instrucciones que se te enviaron al mail.`, code: tokenPago };
        } else {
            console.log(`Hubo un error al inscribir al usuario al curso`);
            logger.error(`Hubo un error al inscribir al usuario al curso`);
            return { statusCode: 500, mensaje: `Upps.. no hemos podido inscribirte al curso` };
        }




    } catch (error) {
        console.error("No se pudo inscribir al curso al estudiante:", error.message);
        logger.error("No se pudo inscribir al curso al estudiante:", error.message);
        return { statusCode: 500, mensaje: "Ups... Hubo un error al inscribirte al curso, contacta con un docente u administrador!" };
    }
}

export const updateAsistenciaProvider = async(codigoInscripcion, asistenciaBody) => {
    try {
        const inscripcion = await Asistencia.findOne({ where: { codigoInscripcion } })
        const pago = await Pago.findOne({ where: { inscripcionId: inscripcion.id } })

        if (!pago) {
            return {
                statusCode: 404,
                mensaje: 'No se ha encontrado un pago para esa inscripción o no hay una inscripción a un curso'
            }
        }

        if (pago.pago) {
            const response = await Asistencia.update(asistenciaBody, { where: { codigoInscripcion } });
            const insc = await Asistencia.findOne({ where: { codigoInscripcion } })
            const curso = await Curso.findOne({ where: { id: inscripcion.cursoId } });
            const usuario = await Usuario.findOne({ where: { id: inscripcion.estudianteId } })
            if (response) {
                if (insc.asistio) {
                    switch (insc.puntaje) {
                        case 'Aprobado':
                            let bodyMailAprob = {
                                nombre: `${usuario.nombre} ${usuario.apellido}`,
                                cursoNombre: curso.nombre,
                                dia: formatoFecha(curso.dia_curso),
                                hora: formatoHora(curso.hora_curso),
                                link: `${front}/usuario/mis-cursos/inscripcion/${insc.codigoInscripcion}`,
                                micuenta: `${front}/usuario/mis-cursos`,
                                year: new Date().getFullYear()
                            }
                            sendMail(usuario.email, `Felicitaciones!!! Has aprobado con éxito el curso de ${curso.nombre} 🙌🏻`, 'curso_aprobado', bodyMailAprob)
                            break;
                        case 'Desaprobado':
                            let bodyMailDesaprob = {
                                nombre: `${usuario.nombre} ${usuario.apellido}`,
                                cursoNombre: curso.nombre,
                                dia: formatoFecha(curso.dia_curso),
                                hora: formatoHora(curso.hora_curso),
                                micuenta: `${front}/usuario/mis-cursos`,
                                year: new Date().getFullYear()
                            }
                            sendMail(usuario.email, `Lo sentimos mucho! No has aprobado con éxito el curso de ${curso.nombre} 😣`, 'curso_desaprobado', bodyMailDesaprob)
                            break;
                        case 'No calificado':
                            console.log("No calificado");
                            return null;
                        default:
                            break;
                    }
                }

                logger.info(`¡Se le marco con éxito el presentismo y la nota al usuario!`);
                return { statusCode: 201, mensaje: "¡Se le marco con éxito el presentismo y la nota  al usuario!" };
            } else {
                logger.info(`No se le marco con éxito el presentismo y la nota  al usuario`);
                return { statusCode: 400, mensaje: "No se le marco con éxito el presentismo  y la nota al usuario" };
            }
        } else {
            logger.info(`El alumno no ha abonado el curso,  no puedes ponerle la asisntencia y calificación correspondiente`);
            return { statusCode: 400, mensaje: "El alumno no ha abonado el curso, no puedes ponerle la asisntencia y calificación correspondiente" };
        }

    } catch (error) {
        console.error("No se pudo colocar la asistencia y la nota  al curso al estudiante:", error.message);
        logger.error("No se pudo colocar la asistencia y la nota  al curso al estudiante:", error.message);
        return { statusCode: 500, mensaje: "Ups... Hubo un error al marcar tu asistencia y la nota  al curso, contacta con un administrador!" };
    }
}

export const deleteAsistenciaProvider = async(id) => {
    try {
        const pagos = await Pago.destroy({ where: { inscripcionId: id } });
        const response = await Asistencia.destroy({ where: { id } });
        if (response && pagos) {
            logger.info(`¡Inscripcion eliminada exitosamente!`);
            return { statusCode: 200, mensaje: "¡Inscripcion eliminada exitosamente!" };
        } else {
            logger.info(`No se pudo eliminar la inscripción`);
            return { statusCode: 400, mensaje: "No se pudo eliminar la inscripción" };
        }
    } catch (error) {
        console.error("No se pudo eliminar la inscripcion del alumno:", error.message);
        logger.error("No se pudo eliminar la inscripcion del alumno:", error.message);
        return { statusCode: 500, mensaje: "Ups... Hubo un error al eliminar la asistencia del alumno, contacta con un administrador!" };
    }
}

export const restoreAsistenciaProvider = async(id) => {
    try {
        const pagos = await Pago.restore({ where: { inscripcionId: id } });
        const response = await Asistencia.restore({ where: { id } });
        if (response && pagos) {
            logger.info(`¡Inscripcion restaurada exitosamente!`);
            return { statusCode: 200, mensaje: "¡Inscripcion restaurada exitosamente!" };
        } else {
            logger.info(`No se pudo restaurar la inscripción`);
            return { statusCode: 400, mensaje: "No se pudo restaurar la inscripción" };
        }
    } catch (error) {
        console.error("No se pudo restaurar la inscripcion del alumno:", error.message);
        logger.error("No se pudo restaurar la inscripcion del alumno:", error.message);
        return { statusCode: 500, mensaje: "Ups... Hubo un error al restaurar la asistencia del alumno, contacta con un administrador!" };
    }
}

export const generateQRPagoProvider = async(code) => {
    try {
        const pago = await Pago.findOne({ where: { tokenPago: code } })
        const qrData = `${pago.tokenPago}`;
        const qrOptions = {
            width: 300, // Define el ancho deseado en píxeles
        };
        // const qrData = `${front}/administracion/cobrar/${pago.tokenPago}`;
        const qrCode = await qr.toDataURL(qrData, qrOptions);
        return qrCode;
    } catch (error) {
        console.error("No se pudo generar el qr del pago para la inscripcion del alumno:", error.message);
        logger.error("No se pudo generar el qr del pago para la inscripcion del alumno:", error.message);
        return { statusCode: 500, mensaje: "Ups... Hubo un error al generar el qr del pago para la asistencia del alumno, contacta con un administrador!" };
    }
}