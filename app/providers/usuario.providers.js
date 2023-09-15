import { config } from "dotenv";
import Usuario from "../models/usuario.model.js";
import path from "path";
import { logger } from "../utils/winston.logger.js";
import cloudinary from "../config/cloudinary.config.js";
import { deleteImageStorage } from "../helpers/image.helpers.js";
import { Op } from "sequelize";
import createSlug from "../utils/createSlug.js";
config();

const upload_preset = process.env.UPLOAD_PRESET || ""

export const getUsuariosProvider = async(limit, page, borrado) => {
    try {
        const whereCondition = {};
        if (borrado === true) {
            whereCondition.deletedAt = {
                [Op.ne]: null,
            };
        } else if (borrado === false) {
            whereCondition.deletedAt = null;
        }

        const size = await Usuario.count({
            paranoid: false,
            where: whereCondition,
        })

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

        const usuarios = await Usuario.findAll({
            paranoid: false,
            where: whereCondition,
            limit,
            offset,
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "password", 'caducidad_token', 'token', 'email_verified_at'],
            },
            order: [
                ["id", "ASC"]
            ],
        });

        if (size > 0) {
            return {
                statusCode: 200,
                data: usuarios,
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
        console.error("No se pudieron obtener los usuarios:", error.message);
        logger.error("No se pudieron obtener los usuarios:", error.message);
        return { statusCode: 500, mensaje: "No se pudieron obtener los usuarios" };
    }
}

export const getUsuarioByIdProvider = async(id) => {
    try {
        const usuario = await Usuario.findOne({
            paranoid: false,
            where: {
                id,
            },
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "password", 'caducidad_token', 'token', 'email_verified_at'],
            },
            order: [
                ["id", "ASC"]
            ],
        })

        if (usuario === null) {
            return {
                statusCode: 404,
                mensaje: "No se encontro ningun usuario con el id buscado",
            };
        }

        return {
            statusCode: 200,
            data: usuario,
        };

    } catch (error) {
        console.error("No se pudieron obtener el usuario buscado:", error.message);
        logger.error("No se pudieron obtener el usuario buscado:", error.message);
        return { statusCode: 500, mensaje: "No se pudieron obtener el usuario buscado" };
    }
}

export const updateUsuarioProvider = async(id, user, imageFile) => {
    try {
        const usuario = await Usuario.findByPk(id);
        if (imageFile != null) {
            if (usuario.public_id !== null) {
                await cloudinary.uploader.destroy(usuario.public_id);
            }

            const img_path = imageFile.path;
            const name_img = path.normalize(img_path).split(path.sep);
            let portada_name = name_img[2];
            let filename = `${~~(Math.random() * 9999)}-${createSlug(user.nombre)}-${createSlug(user.apellido)}`;
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
                deleteImageStorage('usuarios', portada_name);
                return {
                    statusCode: 400,
                    message: `Archivos no soportados por el servidor. Los archivos deben estar en el formato: BMP, GIF, JPG, JPEG, PNG, SVG, WEBP, AVIF. Estás enviando un archivo con esta extensión: ${ext.toUpperCase()}`,
                };
            }

            const uploadImg = await cloudinary.uploader.upload(img_path, {
                upload_preset,
                resource_type: "auto",
                folder: `${upload_preset}/usuarios`,
                public_id: `${filename}`,
            });

            deleteImageStorage('usuarios', portada_name);

            user.avatar = uploadImg.secure_url;
            user.public_id = uploadImg.public_id;
        } else {
            user.avatar = usuario.avatar;
            user.public_id = usuario.public_id;
        }

        // const response = await usuario.save();

        const response = await Usuario.update(user, { where: { id } });

        if (response) {
            logger.info(`¡Haz actualizado tu usuario con éxito!`);
            return { statusCode: 200, mensaje: "¡Haz actualizado tu usuario con éxito!" };
        } else {
            logger.error(`No se pudo actualizar el usuario`);
            return { statusCode: 400, mensaje: 'No se pudo actualizar el usuario' };
        }
    } catch (error) {
        console.error("Hubo un error al querer actualizar un usuario:", error.message);
        logger.error("Hubo un error al querer actualizar un usuario:", error.message);
        return { statusCode: 500, mensaje: "Hubo un error al querer actualizar un usuario" };
    }
}

export const changeEstadoUsuarioProvider = async(id, user, userId) => {
    try {
        if (id == userId) {
            return {
                statusCode: 400,
                mensaje: 'No te puedes deshabilitar tu propio cuenta'
            }
        }
        const response = await Usuario.update(user, { where: { id } });
        if (response) {
            logger.info(`¡Estado cambiado exitosamente!`);
            return { statusCode: 200, mensaje: "¡Estado cambiado exitosamente!" };
        } else {
            logger.error(`No se pudo cambiar el estado al usuario`);
            return { statusCode: 400, mensaje: 'No se pudo cambiar el estado al usuario' };
        }
    } catch (error) {
        console.error("Hubo un error al querer cambiar el estado a un usuario:", error.message);
        logger.error("Hubo un error al querer cambiar el estado a un usuario:", error.message);
        return { statusCode: 500, mensaje: "Hubo un error al querer cambiar el estado a un usuario" };
    }
}

export const deleteUsuarioProvider = async(id, userId) => {
    try {
        if (id == userId) {
            return {
                statusCode: 400,
                mensaje: 'No puedes eliminar tu propio usuario'
            }
        }

        const response = await Usuario.destroy({ where: { id } });

        if (response) {
            logger.info(`¡Usuario eliminado exitosamente!`);
            return { statusCode: 200, mensaje: "¡Usuario eliminado exitosamente!" };
        } else {
            logger.error(`No se pudo eliminar el usuario`);
            return { statusCode: 400, mensaje: 'No se pudo eliminar el usuario' };
        }

    } catch (error) {
        console.error("Hubo un error al querer eliminar un usuario:", error.message);
        logger.error("Hubo un error al querer eliminar un usuario:", error.message);
        return { statusCode: 500, mensaje: "No se pudieron obtener el usuario" };
    }
}

export const restoreUsuarioProvider = async(id) => {
    try {
        const usuario = await Usuario.restore({ where: { id } });

        if (usuario) {
            logger.info(`¡Usuario restaurado exitosamente!`);
            return { statusCode: 200, mensaje: "¡Usuario restaurado exitosamente!" };
        } else {
            logger.error(`No se pudo restaurar el usuario`);
            return { statusCode: 400, mensaje: 'No se pudo restaurar el usuario' };
        }

    } catch (error) {
        console.error("Hubo un error al querer restaurar un usuario:", error.message);
        logger.error("Hubo un error al querer restaurar un usuario:", error.message);
        return { statusCode: 500, mensaje: "Hubo un error al querer restaurar un usuario" };
    }
}