import { body, matchedData, check } from 'express-validator';
import validateResult from '../helpers/validate.helpers.js';

const esImagen = (value) => {
    if (!value) {
        return false; // Permitir campos vacíos (si se requiere)
    }
    // Puedes implementar una lógica para verificar si `value` es una imagen, por ejemplo, comprobando su extensión.
    // Aquí se asume que se verifica la extensión del archivo, pero puedes personalizarlo según tus necesidades.
    const extensionesValidas = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'bmp'];
    const extension = value.split('.').pop().toLowerCase();
    return extensionesValidas.includes(extension);
};


export const curso_validate = [
    body('nombre')
    .notEmpty()
    .withMessage('El nombre del curso es obligatorio'),
    body('descripcion')
    .notEmpty()
    .withMessage('La descripcion del curso es obligatoria'),
    // body('imageFile')
    // .notEmpty()
    // .withMessage('La portada del curso es obligatoria')
    // .custom(esImagen) // Utiliza la función personalizada para verificar si es una imagen
    // .withMessage('La portada del curso debe ser una imagen válida (jpg, jpeg, png, gif, webp, avif, svg, bmp)'),
    body('dia')
    .notEmpty()
    .withMessage('El dia del curso es obligatorio'),
    body('hora')
    .notEmpty()
    .withMessage('La hora del curso es obligatoria'),
    body('duracion')
    .notEmpty()
    .withMessage('La duración del curso es obligatoria'),
    body('precio')
    .notEmpty()
    .withMessage('El precio del curso es obligatorio'),
    body('categoriaId')
    .notEmpty()
    .withMessage('La categoria del curso es obligatoria'),
    body('docenteId')
    .notEmpty()
    .withMessage('El docente del curso es obligatorio'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];