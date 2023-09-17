import { config } from "dotenv";
import { changeEstadoUsuarioProvider, deleteUsuarioProvider, getUsuarioByIdProvider, getUsuariosByRoleDocenteProvider, getUsuariosProvider, newUsuarioProvider, restoreUsuarioProvider, updateUsuarioProvider } from "../providers/usuario.providers.js";
import { generarContrasena } from "../helpers/generatePasswordFake.helpers.js";
import { generateToken } from "../helpers/generateTokens.helpers.js";
import bcrypt from "bcryptjs";
config();

export const getUsuariosService = async(query) => {
    const { l, p, borrado = false } = query;

    const limit = parseInt(l) || parseInt(process.env.PAGE_SIZE);
    const page = parseInt(p) || 1;
    const deleteReg = Boolean(borrado);

    return await getUsuariosProvider(limit, page, deleteReg);
}

export const getUsuarioByIdService = async(params) => {
    const { id } = params;

    return await getUsuarioByIdProvider(id);
}

export const getUsuarioLogueadoService = async(userID) => {
    return await getUsuarioByIdProvider(userID);
}

export const getUsuariosByRoleDocenteService = async() => {
    return getUsuariosByRoleDocenteProvider();
}

export const newUsuarioService = async(body) => {
    const { nombre, apellido, email, roles } = body;

    let password = generarContrasena();

    const usuario = {
        nombre,
        apellido,
        email,
        token: generateToken(60),
        status: false,
        caducidad_token: new Date().setDate(new Date().getDate() + 1),
        password: bcrypt.hashSync(password, 8)
    }

    return await newUsuarioProvider(usuario, roles);
}

export const updateUsuarioService = async(params, body, files) => {
    const { id } = params;
    const { nombre, apellido, password = '', confirm_password = '' } = body;
    const { imageFile } = files;

    if (password != confirm_password) {
        return {
            statusCode: 404,
            mensaje: 'Las contraseñas ingresada no coinciden'
        }
    }

    let user = {}
    if (password != '') {
        user = {
            nombre,
            apellido,
            password: bcrypt.hashSync(password, 8)
        }
    } else {
        user = {
            nombre,
            apellido
        }
    }

    return await updateUsuarioProvider(id, user, imageFile);
}

export const changeEstadoUsuarioService = async(params, body, userId) => {
    const { id } = params;
    const { status } = body;

    let user = {
        status
    }

    return await changeEstadoUsuarioProvider(id, user, userId);
}

export const deleteUsuarioService = async(params, userId) => {
    const { id } = params;

    return await deleteUsuarioProvider(id, userId);
}

export const restoreUsuarioService = async(params) => {
    const { id } = params;

    return await restoreUsuarioProvider(id);
}