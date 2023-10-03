import { config } from "dotenv";
import { deletePagoProvider, getPagoByIdProvider, getPagosProvider, restorePagoProvider, searchPagoByCodeProvider, updatePagoProvider } from "../providers/pago.provider.js";
config();

export const getPagosService = async(query) => {
    const { l, p, borrado = false } = query;

    const limit = parseInt(l) || parseInt(process.env.PAGE_SIZE);
    const page = parseInt(p) || 1;
    const deleteReg = Boolean(borrado);

    return await getPagosProvider(limit, page, deleteReg);
}

export const getPagoByIdService = async(id) => {
    return await getPagoByIdProvider(id);
}

export const searchPagoByCodeService = async(tokenPago) => {
    return await searchPagoByCodeProvider(tokenPago);
}

export const updatePagoService = async(params, body) => {
    const { tokenPago } = params;
    const { pago } = body;

    let fechaPago = null;
    let token = tokenPago

    if (pago) {
        fechaPago = new Date();
        token = null;
    }

    // else {
    //     fechaPago = null
    // }

    let dataPago = {
        pago,
        fechaPago,
        tokenPago: token
    }

    return await updatePagoProvider(tokenPago, dataPago);
}

export const deletePagoService = async(params) => {
    const { id } = params;

    return await deletePagoProvider(id);
}

export const restorePagoService = async(params) => {
    const { id } = params;

    return await restorePagoProvider(id);
}