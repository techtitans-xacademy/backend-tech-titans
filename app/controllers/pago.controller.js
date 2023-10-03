import { deletePagoService, getPagoByIdService, getPagosService, restorePagoService, searchPagoByCodeService, updatePagoService } from "../services/pago.services.js";

export const getPagos = async(req, res) => {
    try {
        const pagoService = await getPagosService(req.query);
        const { statusCode, ...responseData } = pagoService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al obtener los pagos' });
    }
};

export const getPagoByIdOrToken = async(req, res) => {
    try {
        const input = req.params.params;

        switch (true) {
            case /^\d+$/.test(input):
                {
                    const pagoService = await getPagoByIdService(input);
                    const { statusCode, ...responseData } = pagoService;
                    res.status(statusCode).json(responseData);
                    break;
                }
            case /^[a-zA-Z0-9]+$/.test(input):
                {
                    const pagoService = await searchPagoByCodeService(input);
                    const { statusCode, ...responseData } = pagoService;
                    res.status(statusCode).json(responseData);
                    break;
                }
            default:
                {
                    res.status(400).json({ mensaje: "La cadena debe contener solo letras y números." });
                    break;
                }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al obtener el pago buscado' });
    }
}

export const updatePago = async(req, res) => {
    try {
        const pagoService = await updatePagoService(req.params, req.body);
        const { statusCode, ...responseData } = pagoService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al actualizar el pago' });
    }
}

export const deletePago = async(req, res) => {
    try {
        const pagoService = await deletePagoService(req.params);
        const { statusCode, ...responseData } = pagoService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al borrar el pago' });
    }
}

export const restorePago = async(req, res) => {
    try {
        const pagoService = await restorePagoService(req.params);
        const { statusCode, ...responseData } = pagoService;
        res.status(statusCode).json(responseData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mensaje: 'Error al restaurar el pago' });
    }
}