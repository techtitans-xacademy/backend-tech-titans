import Curso from "../models/curso.model.js";
import { logger } from "../utils/winston.logger.js";
import cloudinary from "../config/cloudinary.config.js";
import { deleteImageStorage } from "../helpers/image.helpers.js";
import createSlug from "../utils/createSlug.js";
import path from "path";
import Usuario from "../models/usuario.model.js";
import Categoria from "../models/categoria.model.js";
import { Op } from "sequelize";
import { config } from "dotenv";
config();

const upload_preset = process.env.UPLOAD_PRESET || ""

export const getCursosProvider = async(limit, page, borrado) => {
    try {
        const whereCondition = {};

        if (borrado === true) {
            whereCondition.deletedAt = {
                [Op.ne]: null,
            };
        } else if (borrado === false) {
            whereCondition.deletedAt = null;
        }

        const size = await Curso.count({
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

        const cursos = await Curso.findAll({
            paranoid: false,
            where: whereCondition,
            limit,
            offset,
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "usuarioId", "categoriaId", 'docenteId'],
            },
            order: [
                ["id", "ASC"]
            ],
            include: [{
                    model: Categoria,
                    as: 'categoria',
                    attributes: ["nombre"],
                }, {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["nombre", "apellido", "email"],
                },
                {
                    model: Usuario,
                    as: 'docente',
                    attributes: ["nombre", "apellido"],
                }
            ],
        });
        if (size > 0) {
            return {
                statusCode: 200,
                data: cursos,
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
        return { statusCode: 500, mensaje: "No se pudieron obtener los cursos" };
    }
};

export const getCursosByUserLoggedProvider = async(limit, page, borrado, userId) => {
    try {
        const whereCondition = {};

        if (borrado === true) {
            whereCondition.deletedAt = {
                [Op.ne]: null,
            };
            whereCondition.docenteId = userId;
        } else if (borrado === false) {
            whereCondition.deletedAt = null;
            whereCondition.docenteId = userId;
        }

        console.log(whereCondition);
        const size = await Curso.count({
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

        const cursos = await Curso.findAll({
            paranoid: false,
            where: whereCondition,
            limit,
            offset,
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "usuarioId", "categoriaId"],
            },
            order: [
                ["id", "ASC"]
            ],
            include: [{
                    model: Categoria,
                    as: 'categoria',
                    attributes: ["nombre"],
                }, {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["nombre", "apellido", "email"],
                },
                {
                    model: Usuario,
                    as: 'docente',
                    attributes: ["nombre", "apellido"],
                }
            ],
        });
        if (size > 0) {
            return {
                statusCode: 200,
                data: cursos,
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
        return { statusCode: 500, mensaje: "No se pudieron obtener los cursos" };
    }
}

export const getCursoByIdProvider = async(id) => {
    try {
        const curso = await Curso.findOne({
            paranoid: true,
            where: {
                id,
            },
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "usuarioId", "categoriaId", "docenteId"],
            },
            order: [
                ["nombre", "ASC"]
            ],
            include: [{
                    model: Categoria,
                    as: 'categoria',
                    attributes: ["nombre"],
                }, {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["nombre", "apellido", "email"],
                },
                {
                    model: Usuario,
                    as: 'docente',
                    attributes: ["nombre", "apellido"],
                }
            ],
        });

        if (curso === null)
            return {
                statusCode: 404,
                mensaje: "No se encontro ningun curso con el id buscado",
            };

        return {
            statusCode: 200,
            data: curso,
        };
    } catch (error) {
        console.error("Hubo un error al querer obtener un curso: ", error.message);
        logger.error("Hubo un error al querer obtener un curso: ", error.message);
        return {
            statusCode: 500,
            mensaje: "Hubo un error al querer obtener un curso",
        };
    }
};

export const getCursoBySlugProvider = async(slug) => {
    try {
        const curso = await Curso.findOne({
            paranoid: true,
            where: {
                slug,
            },
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "usuarioId", "categoriaId", "docenteId"],
            },
            order: [
                ["nombre", "ASC"]
            ],
            include: [{
                    model: Categoria,
                    as: 'categoria',
                    attributes: ["nombre"],
                }, {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["nombre", "apellido", "email"],
                },
                {
                    model: Usuario,
                    as: 'docente',
                    attributes: ["nombre", "apellido"],
                }
            ],
        });

        if (curso === null)
            return {
                statusCode: 404,
                mensaje: "No se encontro ningun curso con el slug buscado",
            };

        return {
            statusCode: 200,
            data: curso,
        };
    } catch (error) {
        console.error("Hubo un error al querer obtener un curso: ", error.message);
        logger.error("Hubo un error al querer obtener un curso: ", error.message);
        return {
            statusCode: 500,
            mensaje: "Hubo un error al querer obtener un curso",
        };
    }
};

export const newCursoProvider = async(cursoData, imageFile) => {
    try {
        if (imageFile != null) {
            const img_path = imageFile.path;
            const name_img = path.normalize(img_path).split(path.sep);
            let portada_name = name_img[2];
            let filename = `${~~(Math.random() * 9999)}-${createSlug(
        cursoData.nombre
      )}`;
            let splitName = name_img[2].split(".");
            let ext = splitName[1];

            if (
                ext !== "jpg" &&
                ext !== "jpeg" &&
                ext !== "png" &&
                ext !== "webp" &&
                ext !== "avif" &&
                ext !== "gif" &&
                ext !== "bmp" &&
                ext !== "svg"
            ) {
                logger.error(
                    `Archivos no soportados por el servidor. Estás enviando un archivo con esta extensión: ${ext}`
                );
                deleteImageStorage('cursos', portada_name);
                return {
                    statusCode: 400,
                    message: `Archivos no soportados por el servidor. Los archivos deben estar en el formato: BMP, GIF, JPG, JPEG, PNG, SVG, WEBP, AVIF. Estás enviando un archivo con esta extensión: ${ext.toUpperCase()}`,
                };
            }

            const uploadImg = await cloudinary.uploader.upload(img_path, {
                upload_preset,
                resource_type: "auto",
                folder: `${upload_preset}/cursos`,
                public_id: `${filename}`,
            });

            deleteImageStorage('cursos', portada_name);

            cursoData.portada = uploadImg.secure_url;
            cursoData.public_id = uploadImg.public_id;
        } else {
            cursoData.portada = 'https://res.cloudinary.com/fabrizio-dev/image/upload/v1694810742/santex/cursos/no-image.jpg';
            cursoData.public_id = null;
        }

        cursoData.slug = createSlug(cursoData.nombre);
        const curso = await Curso.create(cursoData);

        if (curso) {
            logger.info(`¡Curso creado exitosamente!`);
            return { statusCode: 201, mensaje: "¡Curso creado exitosamente!" };
        } else {
            logger.error(`No se pudo crear el curso`);
            return { statusCode: 400, mensaje: "No se pudo crear el curso" };
        }
    } catch (error) {
        console.error("Hubo un error al querer crear un curso: ", error.message);
        logger.error("Hubo un error al querer crear un curso: ", error.message);
        return {
            statusCode: 500,
            mensaje: "Hubo un error al querer crear un curso",
        };
    }
};

export const updateCursoProvider = async(id, cursoData, imageFile) => {
    try {
        const curso = await Curso.findByPk(id);
        if (!curso)
            return { statusCode: 404, message: "No se encontro un curso con ese id" };
        if (imageFile != null) {
            if (curso.public_id !== null) {
                await cloudinary.uploader.destroy(curso.public_id);
            }

            const img_path = imageFile.path;
            const name_img = path.normalize(img_path).split(path.sep);
            let portada_name = name_img[2];
            let filename = `${~~(Math.random() * 9999)}-${createSlug(cursoData.nombre)}`;
            let splitName = name_img[2].split(".");
            let ext = splitName[1];

            if (
                ext !== "jpg" &&
                ext !== "jpeg" &&
                ext !== "png" &&
                ext !== "webp" &&
                ext !== "avif" &&
                ext !== "gif" &&
                ext !== "bmp" &&
                ext !== "svg"
            ) {
                logger.error(
                    `Archivos no soportados por el servidor. Estás enviando un archivo con esta extensión: ${ext}`
                );
                deleteImageStorage('cursos', portada_name);
                return {
                    statusCode: 400,
                    message: `Archivos no soportados por el servidor. Los archivos deben estar en el formato: BMP, GIF, JPG, JPEG, PNG, SVG, WEBP, AVIF. Estás enviando un archivo con esta extensión: ${ext.toUpperCase()}`,
                };
            }

            const uploadImg = await cloudinary.uploader.upload(img_path, {
                upload_preset,
                resource_type: "auto",
                folder: `${upload_preset}/cursos`,
                public_id: `${filename}`,
            });

            deleteImageStorage('cursos', portada_name);

            cursoData.portada = uploadImg.secure_url;
            cursoData.public_id = uploadImg.public_id;
        } else {
            cursoData.portada = curso.portada;
            cursoData.public_id = curso.public_id;
        }

        cursoData.slug = createSlug(cursoData.nombre);

        const response = await Curso.update(cursoData, { where: { id } });

        if (response) {
            logger.info(`¡Curso actualizado exitosamente!`);
            return { statusCode: 201, mensaje: "¡Curso actualizado exitosamente!" };
        } else {
            logger.error(`No se pudo actualizar el curso`);
            return { statusCode: 400, mensaje: "No se pudo actualizar el curso" };
        }
    } catch (error) {
        console.error(
            "Hubo un error al querer actualizar el curso: ",
            error.message
        );
        logger.error(
            "Hubo un error al querer actualizar el curso: ",
            error.message
        );
        return {
            statusCode: 500,
            mensaje: "Hubo un error al querer actualizar el curso",
        };
    }
};

export const deleteCursoProvider = async(id) => {
    try {
        const response = await Curso.destroy({ where: { id } });
        if (response) {
            logger.info(`¡Curso eliminado exitosamente!`);
            return { statusCode: 200, mensaje: "¡Curso eliminado exitosamente!" };
        } else {
            logger.error(`No se pudo eliminar el curso`);
            return { statusCode: 400, mensaje: "No se pudo eliminar el curso" };
        }
    } catch (error) {
        console.error("Hubo un error al querer eliminar un curso: ", error.message);
        logger.error("Hubo un error al querer eliminar un curso: ", error.message);
        return {
            statusCode: 500,
            mensaje: "Hubo un error al querer eliminar un curso",
        };
    }
};

export const restoreCursoProvider = async(id) => {
    try {
        const curso = await Curso.restore({ where: { id } });
        if (curso) {
            logger.info(`¡Curso restaurado exitosamente!`);
            return { statusCode: 200, mensaje: "¡Curso restaurado exitosamente!" };
        } else {
            logger.error(`No se pudo restaurar el curso`);
            return { statusCode: 400, mensaje: "No se pudo restaurar el curso" };
        }
    } catch (error) {
        console.error('Hubo un error al querer restaurar un curso: ', error.message);
        logger.error('Hubo un error al querer restaurar un curso: ', error.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer restaurar un curso' };
    }
}