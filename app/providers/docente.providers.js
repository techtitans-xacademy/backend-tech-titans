import Docente from "../models/docente.model.js";
import Usuario from "../models/usuario.model.js";
import { logger } from "../utils/winston.logger.js";
import cloudinary from '../config/cloudinary.config.js';
import { deleteImageStorage } from "../helpers/image.helpers.js";
import createSlug from "../utils/createSlug.js";
import path from 'path';

import { Op } from 'sequelize';

export const getDocentesProvider = async(limit, page, borrado) => {
    try {
        const whereCondition = {};

        if (borrado == true) {
            whereCondition.deletedAt = {
                [Op.ne]: null
            };
        } else if (borrado == false) {
            whereCondition.deletedAt = null;
        }

        console.log(whereCondition);

        const size = await Docente.count({
            paranoid: false,
            where: whereCondition
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

        const docentes = await Docente.findAll({
            paranoid: false,
            where: whereCondition,
            limit,
            offset,
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt', 'usuarioId'] },
            order: [
                ["id", "ASC"]
            ],
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['nombre', 'apellido', 'email']
            }]
        });

        if (size > 0) {
            return {
                statusCode: 200,
                data: docentes,
                pagination: {
                    page,
                    limit,
                    total: size,
                    totalPages,
                    lastPage,
                    nextPage
                }
            }
        } else {
            return {
                statusCode: 200,
                data: docentes
            }
        }
    } catch (err) {
        console.error('Hubo un error al querer obtener los docentes: ', err.message);
        logger.error('Hubo un error al querer obtener los docentes: ', err.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer obtener los docentes' };
    }
}

export const getDocentePorIdProvider = async(id) => {
    try {
        const docente = await Docente.findOne({
            paranoid: true,
            where: {
                id
            },
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt', 'usuarioId', ] },
            order: [
                ["nombre", "ASC"]
            ],
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['nombre', 'apellido', 'email']
            }]
        });

        if (docente !== null) {
            return {
                statusCode: 200,
                data: docente
            }
        } else {
            return {
                statusCode: 404,
                mensaje: "No se encontro ninguna docente con el id buscado"
            }
        }
    } catch (error) {
        console.error('Hubo un error al querer obtener un docente: ', error.message);
        logger.error('Hubo un error al querer obtener un docente: ', error.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer obtener un docente' };
    }
}

export const newDocenteProvider = async(docenteData, imageFile) => {
    try {
        if (imageFile != null) {
            const img_path = imageFile.path;
            // const name_img = img_path.split("\\"); // para windows utilizar \\ y para linux /
            const name_img = path.normalize(img_path).split(path.sep);
            let portada_name = name_img[2];
            let filename = `${~~(Math.random() * 9999)}-${createSlug(docenteData.nombre)}-${createSlug(docenteData.apellido)}`
            let splitName = name_img[2].split('.');
            let ext = splitName[1];

            if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png' && ext !== 'webp' && ext !== 'avif' && ext !== 'gif' && ext !== 'bmp' && ext !== 'svg') {
                logger.error(`Archivos no soportados por el servidor. Estás enviando un archivo con esta extensión: ${ext}`);
                deleteImageStorage('docente', portada_name);
                return {
                    statusCode: 400,
                    message: `Archivos no soportados por el servidor. Los archivos deben estar en el formato: BMP, GIF, JPG, JPEG, PNG, SVG, WEBP, AVIF. Estás enviando un archivo con esta extensión: ${ext.toUpperCase()}`
                };
            }

            const uploadImg = await cloudinary.uploader.upload(img_path, {
                upload_preset: 'santex',
                resource_type: "auto",
                folder: 'santex/docente',
                public_id: `${filename}`,
            });

            deleteImageStorage('docente', portada_name);

            docenteData.avatar = uploadImg.secure_url;
            docenteData.public_id = uploadImg.public_id;
        } else {
            docenteData.avatar = 'https://res.cloudinary.com/fabrizio-dev/image/upload/v1694024409/santex/docente/default_docente.webp';
        }

        const docente = await Docente.create(docenteData);
        if (docente) {
            logger.info(`¡Docente creado exitosamente!`);
            return { statusCode: 201, mensaje: "¡Docente creado exitosamente!" };
        } else {
            logger.error(`No se pudo crear el docente`);
            return { statusCode: 400, mensaje: 'No se pudo crear el docente' };
        }
    } catch (error) {
        console.error('Hubo un error al querer crear un docente: ', error.message);
        logger.error('Hubo un error al querer crear un docente: ', error.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer crear un docente' };
    }
}

export const updateDocenteProvider = async(id, docenteData, imageFile) => {
    try {
        const docente = await Docente.findByPk(id);
        if (!docente) return { statusCode: 404, message: 'No se encontro un docente con ese id' };

        if (imageFile != null) {

            if (docente.public_id !== null) {
                await cloudinary.uploader.destroy(docente.public_id);
            }

            const img_path = imageFile.path;
            const name_img = path.normalize(img_path).split(path.sep);
            let portada_name = name_img[2];
            let filename = `${~~(Math.random() * 9999)}-${createSlug(docenteData.nombre)}-${createSlug(docenteData.apellido)}`
            let splitName = name_img[2].split('.');
            let ext = splitName[1];

            if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png' && ext !== 'webp' && ext !== 'avif' && ext !== 'gif' && ext !== 'bmp' && ext !== 'svg') {
                logger.error(`Archivos no soportados por el servidor. Estás enviando un archivo con esta extensión: ${ext}`);
                deleteImageStorage('docente', portada_name);
                return {
                    statusCode: 400,
                    message: `Archivos no soportados por el servidor. Los archivos deben estar en el formato: BMP, GIF, JPG, JPEG, PNG, SVG, WEBP, AVIF. Estás enviando un archivo con esta extensión: ${ext.toUpperCase()}`
                };
            }

            const uploadImg = await cloudinary.uploader.upload(img_path, {
                upload_preset: 'santex',
                resource_type: "auto",
                folder: 'santex/docente',
                public_id: `${filename}`,
            });

            deleteImageStorage('docente', portada_name);

            docenteData.avatar = uploadImg.secure_url;
            docenteData.public_id = uploadImg.public_id;
        } else {
            docenteData.avatar = docente.avatar;
            docenteData.public_id = docente.public_id;
        }

        const response = await Docente.update(docenteData, { where: { id } })

        if (response) {
            logger.info(`¡Docente actualizado exitosamente!`);
            return { statusCode: 201, mensaje: "¡Docente actualizado exitosamente!" };
        } else {
            logger.error(`No se pudo actualizar el docente`);
            return { statusCode: 400, mensaje: 'No se pudo actualizar el docente' };
        }

    } catch (error) {
        console.error('Hubo un error al querer actualizar el docente: ', error.message);
        logger.error('Hubo un error al querer actualizar el docente: ', error.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer actualizar el docente' };
    }
}

export const deleteDocenteProvider = async(id) => {
    try {
        const docente = await Docente.destroy({ where: { id } });
        if (docente) {
            logger.info(`¡Docente eliminado exitosamente!`);
            return { statusCode: 200, mensaje: "¡Docente eliminado exitosamente!" };
        } else {
            logger.error(`No se pudo eliminar el docente`);
            return { statusCode: 400, mensaje: 'No se pudo eliminar el docente' };
        }
    } catch (error) {
        console.error('Hubo un error al querer eliminar un docente: ', error.message);
        logger.error('Hubo un error al querer eliminar un docente: ', error.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer eliminar un docente' };
    }
}

export const restoreDocenteProvider = async(id) => {
    try {
        const docente = await Docente.restore({ where: { id } });
        if (docente) {
            logger.info(`¡Docente restaurado exitosamente!`);
            return { statusCode: 200, mensaje: "¡Docente restaurado exitosamente!" };
        } else {
            logger.error(`No se pudo restaurar el docente`);
            return { statusCode: 400, mensaje: 'No se pudo restaurar el docente' };
        }
    } catch (error) {
        console.error('Hubo un error al querer restaurar un docente: ', error.message);
        logger.error('Hubo un error al querer restaurar un docente: ', error.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer restaurar un docente' };
    }
}