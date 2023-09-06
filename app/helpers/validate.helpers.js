import { validationResult } from 'express-validator';

const validateResult = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        const cleanedErrors = Object.keys(err.errors).map(key => {
            const cleanedError = {...err.errors[key] };
            cleanedError.mensaje = cleanedError.msg;
            cleanedError.campo = cleanedError.path;
            delete cleanedError.path;
            delete cleanedError.msg;
            delete cleanedError.value;
            delete cleanedError.type;
            delete cleanedError.location;
            return cleanedError;
        });
        res.status(403).send({ errors: cleanedErrors })
    }
}

export default validateResult