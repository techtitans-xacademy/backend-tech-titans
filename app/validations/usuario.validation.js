import { body } from 'express-validator';
import validateResult from '../helpers/validate.helpers.js';

export const usuario_validator = [
    body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
    body('apellido')
    .notEmpty()
    .withMessage('El apellido es obligatorio'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

export const usuario_validator_estado = [
    body('status')
    .notEmpty()
    .withMessage('El estado es obligatorio'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]