import Categoria from "../models/categoria.model.js";
import Usuario from "../models/usuario.model.js";
import { logger } from "../utils/winston.logger.js";

import { Op } from 'sequelize';

export const getCategoriasProvider = async(limit, page, borrado) => {
    try {
        const whereCondition = {};

        if (borrado === true) {
            whereCondition.deletedAt = {
                [Op.ne]: null
            };
        } else if (borrado === false) {
            whereCondition.deletedAt = null;
        }


        const size = await Categoria.count({
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

        const categorias = await Categoria.findAll({
            paranoid: false,
            where: whereCondition,
            limit,
            offset,
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt', 'usuarioId'] },
            order: [
                ["nombre", "ASC"]
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
                data: categorias,
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
                data: categorias
            }
        }
    } catch (err) {
        console.error('Hubo un error al querer obtener las categorias: ', err.message);
        logger.error('Hubo un error al querer obtener las categorias: ', err.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer obtener las categorias' };
    }
}

export const getCategoriasPorIdProvider = async(id) => {
    try {
        const categoria = await Categoria.findOne({
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

        if (categoria !== null) {
            return {
                statusCode: 200,
                data: categoria
            }
        } else {
            return {
                statusCode: 404,
                mensaje: "No se encontro ninguna categoria con el id buscado"
            }
        }
    } catch (error) {
        console.error('Hubo un error al querer obtener una categoria: ', error.message);
        logger.error('Hubo un error al querer obtener una categoria: ', error.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer obtener una categoria' };
    }
}

export const newCategoriaProvider = async(nombre, userId) => {
    try {
        const categoria = await Categoria.create({
            nombre,
            usuarioId: userId
        });
        if (categoria) {
            logger.info(`¡Categoría creada exitosamente!`);
            return { statusCode: 201, mensaje: "¡Categoría creada exitosamente!" };
        } else {
            logger.error(`No se pudo crear la categoría`);
            return { statusCode: 400, mensaje: 'No se pudo crear la categoría' };
        }
    } catch (error) {
        console.error('Hubo un error al querer crear una categoria: ', error.message);
        logger.error('Hubo un error al querer crear una categoria: ', error.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer crear una categoria' };
    }
}

export const updateCategoriaProvider = async(id, nombre, userId) => {
    try {
        const categoria = await Categoria.update({
            nombre,
            usuarioId: userId
        }, { where: { id } });
        if (categoria) {
            logger.info(`¡Categoría actualizada exitosamente!`);
            return { statusCode: 200, mensaje: "¡Categoría actualizada exitosamente!" };
        } else {
            logger.error(`No se pudo actualizar la categoría`);
            return { statusCode: 400, mensaje: 'No se pudo actualizar la categoría' };
        }
    } catch (error) {
        console.error('Hubo un error al querer actualizar una categoria: ', error.message);
        logger.error('Hubo un error al querer actualizar una categoria: ', error.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer actualizar una categoria' };
    }
}

export const deleteCategoriaProvider = async(id) => {
    try {
        const categoria = await Categoria.destroy({ where: { id } });
        if (categoria) {
            logger.info(`¡Categoría eliminada exitosamente!`);
            return { statusCode: 200, mensaje: "¡Categoría eliminada exitosamente!" };
        } else {
            logger.error(`No se pudo eliminar la categoría`);
            return { statusCode: 400, mensaje: 'No se pudo eliminar la categoría' };
        }
    } catch (error) {
        console.error('Hubo un error al querer eliminar una categoria: ', error.message);
        logger.error('Hubo un error al querer eliminar una categoria: ', error.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer eliminar una categoria' };
    }
}

export const restoreCategoriaProvider = async(id) => {
    try {
        const categoria = await Categoria.restore({ where: { id } });
        if (categoria) {
            logger.info(`¡Categoría restaurada exitosamente!`);
            return { statusCode: 200, mensaje: "¡Categoría restaurada exitosamente!" };
        } else {
            logger.error(`No se pudo restaurar la categoría`);
            return { statusCode: 400, mensaje: 'No se pudo restaurar la categoría' };
        }
    } catch (error) {
        console.error('Hubo un error al querer restaurar una categoria: ', error.message);
        logger.error('Hubo un error al querer restaurar una categoria: ', error.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer restaurar una categoria' };
    }
}