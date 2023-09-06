import { forgotPasswordUserProvider, loginUserProvider, newPasswordUserProvider, reactiveUserProvider, recoveryPasswordUserProvider, refreshTokenUserProvider, registerUserProvider, verifyNewUserProvider, verifyUserProvider } from '../providers/auth.providers.js';

export const registerUserService = async(body) => {
    const { nombre, apellido, email, password, roles } = body;

    const usuario = {
        nombre,
        apellido,
        email,
        token: generateToken(60),
        status: false,
        caducidad_token: new Date().setDate(new Date().getDate() + 1),
        password: bcrypt.hashSync(password, 8)
    }

    return await registerUserProvider(usuario, roles);
}

export const verifyUserService = async(params) => {

    const { token } = params;
    return await verifyUserProvider(token);
}

export const verifyNewUserService = async(params) => {
    const { token } = params;

    return await verifyNewUserProvider(token);
}

export const loginUserService = async(body) => {
    const { email, password } = body;

    return await loginUserProvider(email, password);
}

export const forgotPasswordUserService = async(body) => {
    const { email } = body;
    return await forgotPasswordUserProvider(email);
}

export const recoveryPasswordUserService = async(params, body) => {
    const { token } = params;
    const { password, confirm_password } = body;

    if (password != confirm_password) {
        return { statusCode: 404, mensaje: 'Las contraseñas no coinciden 😣' };
    }

    return await recoveryPasswordUserProvider(token, password);
}

export const refreshTokenUserService = async(body) => {
    const { oldToken } = body;
    const decoded = Jwt.verify(oldToken, secret);
    const userId = decoded.id;

    if (oldToken === null) {
        return { statusCode: 400, mensaje: 'El token no puede estar en blanco.' };;
    }

    return await refreshTokenUserProvider(userId);
}

export const reactiveUserService = async(body) => {
    const { email } = body;
    return await reactiveUserProvider(email);
}

export const newPasswordUserService = async(params, body) => {
    const { token } = params;
    const { password, confirm_password } = body;

    if (password != confirm_password) {
        return { statusCode: 404, mensaje: 'Las contraseñas no coinciden 😣' };
    }

    return await newPasswordUserProvider(token, password);
}