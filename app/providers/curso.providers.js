import Curso from "../models/curso.model.js";
import Usuario from "../models/usuario.model.js";

export const getCursosProvider = async () => {
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

export const gestionarCursosDeUsuarioProvider = async (id, cursos, userId) => {
    try {
        let arrayCursos = [];
        let arrayCursosQ = [];

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return { statusCode: 404, mensaje: 'Usuario no encontrado' };
        }

            const cursosActuales = await usuario.getCursos(); // Asumiendo que hay una relación entre Usuario y Curso

        const cursosAgregar = cursos.filter(curso => !cursosActuales.some(cursoActual => cursoActual.nombre === curso));

        const cursosQuitar = cursosActuales.filter(cursoActual => !cursos.includes(cursoActual.nombre));

        cursosActuales.forEach(curso => {
            arrayCursos.push(curso);
        });
        cursosQuitar.forEach(curso => {
            // Lógica para quitar cursos específicos?
            arrayCursosQ.push(curso);
        });

        // Lógica para agregar o quitar cursos, similar a la función de roles?

    } catch (error) {
        console.error('No se pudieron actualizar los cursos de usuario:', error);
        return { statusCode: 500, mensaje: 'No se pudieron actualizar los cursos de usuario' };
    }
}

