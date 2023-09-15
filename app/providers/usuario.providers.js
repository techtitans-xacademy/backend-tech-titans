import Usuario from "../models/usuario.model.js";
import { logger } from "../utils/winston.logger.js";

export const getUsuariosProviders = async(limit, page, borrado) => {
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
                exclude: ["deletedAt", "createdAt", "updatedAt", "password"],
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