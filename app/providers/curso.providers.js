import Curso from "../models/curso.model.js";

export const getCursosProvider = async() => {
    try {
        return await Curso.findAll({
            order: [
                ["nombre", "ASC"]
            ]
        });
    } catch (error) {
        return error.message;
    }
}