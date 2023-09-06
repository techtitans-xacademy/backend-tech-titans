import { body, matchedData, check } from 'express-validator';
import validateResult from '../helpers/validate.helpers.js';

export const docente_validation = [
    body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
    body('apellido')
    .notEmpty()
    .withMessage('El apellido es obligatorio'),
    body('email')
    .notEmpty().withMessage('El correo electrónico es obligatorio.')
    .isEmail().withMessage('El correo electrónico debe ser una dirección de correo electrónico válida.'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];