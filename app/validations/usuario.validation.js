import { body } from 'express-validator';
import validateResult from '../helpers/validate.helpers.js';


export const new_user = [
    body('nombre').notEmpty().withMessage('El campo de nombre es obligatorio..'),
    body('apellido').notEmpty().withMessage('El campo apellido es obligatorio.'),
    body('email')
    .notEmpty().withMessage('El campo de correo electrónico es obligatorio.')
    .isEmail().withMessage('El campo de correo electrónico debe ser una dirección de correo electrónico válida.'),
    body('roles')
    .notEmpty().withMessage('Los roles son obligatorios')
    .isArray().withMessage('Los roles deben ser un array de strings')
    .custom((value) => {
        if (!Array.isArray(value)) {
            throw new Error('Los roles deben ser un array');
        }
        for (const role of value) {
            if (typeof role !== 'string') {
                throw new Error('Cada elemento de "roles" debe ser una cadena de texto (string)');
            }
        }
        return true;
    }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]


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