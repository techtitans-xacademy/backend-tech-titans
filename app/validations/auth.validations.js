import { body, matchedData, check } from 'express-validator';
import validateResult from '../helpers/validate.helpers.js';

// Validation para iniciar sesion
export const login_user = [
    body('email')
    .notEmpty().withMessage('El campo de correo electrónico es obligatorio.')
    .isEmail().withMessage('El campo de correo electrónico debe ser una dirección de correo electrónico válida.'),
    body('password')
    .notEmpty().withMessage('El campo de contraseña es obligatorio.')
    .isLength({ min: 6, max: 20 }).withMessage('La contraseña debe tener entre 6 y 20 caracteres.')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe contener al menos un símbolo'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

// Validation para registrarse
export const register_user = [
    body('nombre').notEmpty().withMessage('El campo de nombre es obligatorio..'),
    body('apellido').notEmpty().withMessage('El campo apellido es obligatorio.'),
    body('email')
    .notEmpty().withMessage('El campo de correo electrónico es obligatorio.')
    .isEmail().withMessage('El campo de correo electrónico debe ser una dirección de correo electrónico válida.'),
    body('password')
    .notEmpty().withMessage('El campo de contraseña es obligatorio.')
    .isLength({ min: 6, max: 20 }).withMessage('La contraseña debe tener entre 6 y 20 caracteres.')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe contener al menos un símbolo'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

export const forgot_password = [
    body('email')
    .notEmpty().withMessage('El campo de correo electrónico es obligatorio.')
    .isEmail().withMessage('El campo de correo electrónico debe ser una dirección de correo electrónico válida.'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

export const recovery_pass = [
    body('password')
    .notEmpty().withMessage('El campo de contraseña es obligatorio.')
    .isLength({ min: 6, max: 20 }).withMessage('La contraseña debe tener entre 6 y 20 caracteres.')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe contener al menos un símbolo'),
    body('confirm_password')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no coinciden.');
        }
        return true;
    }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

export const refresh_token = [
    body('oldToken')
    .notEmpty().withMessage('El campo de oldToken es obligatorio.'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]