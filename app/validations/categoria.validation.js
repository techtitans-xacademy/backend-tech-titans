import { body, matchedData, check } from 'express-validator';
import validateResult from '../helpers/validate.helpers.js';

export const nueva_cat = [
    body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio...'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];

export const update_cat = [
    body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio...'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];