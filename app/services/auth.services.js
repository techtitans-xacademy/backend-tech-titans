import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendMail } from '../mails/config.mails.js';
import { generateToken } from "../helpers/generateTokens.helpers.js";
import { config } from "dotenv";
import { forgotPasswordUserProvider, loginUserProvider, reactiveUserProvider, recoveryPasswordUserProvider, refreshTokenUserProvider, registerUserProvider, verifyUserProvider } from '../providers/auth.providers.js';
import { logger } from "../utils/winston.logger.js";
config();

const front = process.env.HOST_FRONT_EMAIL;
const secret = process.env.JWT_SECRET || "";

export const registerUserService = async(body) => {
    const { nombre, apellido, email, password, roles } = body;

    let token_user = generateToken(60);
    let link = `${front}/auth/verificar/${token_user}`;

    let fullName = `${nombre} ${apellido}`;
    let bodyMail = {
        name: fullName,
        link: link
    };

    let hoy = new Date();
    const usuario = {
        nombre,
        apellido,
        email,
        token: token_user,
        status: false,
        caducidad_token: hoy.setDate(hoy.getDate() + 1),
        password: bcrypt.hashSync(password, 8)
    }

    const userProvider = await registerUserProvider(usuario, roles);

    if (userProvider) {
        logger.info(`El usuario con el email: ${email} ha creado un nuevo usuario.`);
        sendMail(email, `${nombre}, por favor verifique su dirección de correo electrónico`, 'confirm', bodyMail);
        return { statusCode: 201, mensaje: "¡El usuario se registró exitosamente! Por favor revise su correo electrónico para verificar su cuenta." };
    } else {
        return { statusCode: 400, mensaje: 'No se ha podido registrar el usuario.' }
    }

}

export const verifyUserService = async(token) => {
    const user = await verifyUserProvider(token);

    if (user.email_verified_at !== null) return { statusCode: 200, mensaje: "Correo electrónico ya verificado" };

    if (user) {
        try {
            let fechaActual = new Date();

            if (fechaActual <= user.caducidad_token) {
                user.email_verified_at = new Date();
                user.status = true;
                user.token = null;
                user.caducidad_token = null;
                let userUpdate = await user.save();
                if (userUpdate) {
                    if (userUpdate) account_data(user, `${user.nombre}, tu cuenta ya está verificada, estos son los detalles de tu cuenta`)
                    return { statusCode: 200, mensaje: "¡Correo electrónico verificado exitosamente!" };
                } else {
                    return { statusCode: 400, mensaje: "No se pudo verificar la cuenta" };
                }
            } else {
                let token_user = generateToken(60);
                let link = `${front}/auth/verificar/${token_user}`;
                let bodyMail = {
                    name: user.nombre,
                    link: link
                };
                let hoy = new Date();
                user.token = token_user;
                user.caducidad_token = hoy.setDate(hoy.getDate() + 1);
                let userUpdate = await user.save();
                if (userUpdate) {
                    sendMail(user.email, 'Volver a verificar la dirección de correo electrónico', 'reconfirm', bodyMail);
                    return { statusCode: 200, mensaje: "Se le envió un correo electrónico para confirmar su cuenta nuevamente porque su tiempo de gracia expiró." };
                } else {
                    return { statusCode: 400, mensaje: "No se pudo enviar para volver a verificar la cuenta" };
                }
            }
        } catch (error) {
            console.error('Failed to update user:', error);
            return { statusCode: 500, mensaje: 'No se pudo actualizar el usuario' };
        }
    } else {
        return { statusCode: 404, mensaje: 'No se encontró ningún usuario con el token ingresado' };
    }
}

export const verifyNewUserService = async(params) => {
    try {

        const { token } = params;

        const user = await verifyUserProvider(token);

        if (user.email_verified_at !== null) return { statusCode: 200, message: "Correo electrónico ya verificado" };

        if (user) {
            try {
                let fechaActual = new Date();

                if (fechaActual <= user.caducidad_token) {
                    user.email_verified_at = new Date();
                    let token = generateToken(60);
                    let link = `${front}/auth/nueva-clave/${token}`;
                    let bodyMail = {
                        name: `${user.nombre} ${user.apellido}`,
                        link: link,
                        year: new Date().getFullYear()
                    };
                    let horaActual = new Date();

                    user.token = token;
                    user.caducidad_token = horaActual.setMinutes(horaActual.getMinutes() + 60);
                    user.status = true;


                    let userUpdate = await user.save();
                    if (userUpdate) {
                        if (user) sendMail(user.email, `${user.nombre}, por favor genera una nueva contraseña para tu cuenta`, 'new_password', bodyMail);
                        logger.info(`Se ha verificado la cuenta de ${user.email}, ahora tiene que crear una nueva clave`);
                        return { statusCode: 200, message: "¡Cuenta verificada exitosamente!" };
                    } else {
                        return { statusCode: 400, message: "No se pudo verificar la cuenta" };
                    }
                } else {
                    let token_user = generateToken(60);
                    let link = `${front}/auth/nueva-cuenta/verificar/${token_user}`;
                    let body = {
                        name: user.nombre,
                        link: link
                    };
                    let hoy = new Date();
                    user.token = token_user;
                    user.caducidad_token = hoy.setDate(hoy.getDate() + 1);
                    let userUpdate = await user.save();
                    if (userUpdate) {
                        sendMail(user.email, 'Volver a verificar la dirección de correo electrónico', 'confirm', body);
                        return { statusCode: 200, message: "Se le envió un correo electrónico para confirmar su cuenta nuevamente porque su tiempo de gracia expiró." };
                    } else {
                        return { statusCode: 400, message: "No se pudo enviar para volver a verificar la cuenta" };
                    }
                }
            } catch (error) {
                console.error('Failed to update user:', error);
                return { statusCode: 500, message: 'Failed to update user' };
            }
        } else {
            return { statusCode: 404, message: 'No user found with the entered token' };
        }
    } catch (error) {
        console.error('Failed to verify token:', error);
        return { statusCode: 500, message: 'Failed to verify token' };
    }
}

export const loginUserService = async(body) => {
    try {
        const { email, password } = body;

        const user = await loginUserProvider(email);

        if (!user) {
            return { statusCode: 404, mensaje: "Usuario no encontrado." };
        }

        let passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return {
                statusCode: 400,
                mensaje: "Correo electrónico o contraseña inválido. Por favor intente de nuevo"
            };
        }

        if (user.email_verified_at === null) {
            return { statusCode: 401, mensaje: "Correo electrónico no verificado, verifique su correo electrónico para activar la cuenta." };
        }

        if (user.status === false) {
            return { statusCode: 401, mensaje: "La cuenta no está activa, comuníquese con el administrador del sistema." };
        }

        let authorities = [];
        const roles = await user.getRols();

        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].nombre.toUpperCase());
        }

        let token = Jwt.sign({
                id: user.id,
                nombre: `${user.nombre}`,
                apellido: `${user.apellido}`,
                email: user.email,
                roles: authorities
            },
            secret, {
                expiresIn: '1h'
            }
        );

        return {
            statusCode: 200,
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            roles: authorities,
            accessToken: token
        };
    } catch (error) {
        return { statusCode: 500, mensaje: error.message }
    }
}

export const forgotPasswordUserService = async(body) => {
    try {
        const { email } = body;
        const user = await forgotPasswordUserProvider(email);

        if (user.email_verified_at === null) {
            return { statusCode: 401, mensaje: "Correo electrónico no verificado, verifique su correo electrónico para activar la cuenta." };
        }

        if (user.status === false) {
            return { statusCode: 401, mensaje: "La cuenta no está activa, comuníquese con el administrador del sistema." };
        }

        if (user === null) {
            console.log(`No se encontro un usuario con ese token`.bgWhite.red);
            return { statusCode: 400, mensaje: 'El token ingresado no es válido o no pertenece a ningún usuario.' };
        } else {
            let token = generateToken(60);
            let link = `${front}/auth/recuperar-clave/${token}`;
            let bodyMail = {
                name: user.nombre,
                username: user.email,
                link: link,
                year: new Date().getFullYear()
            };
            let horaActual = new Date();

            user.token = token;
            user.caducidad_token = horaActual.setMinutes(horaActual.getMinutes() + 60);
            let userUpdate = await user.save();
            if (userUpdate) {
                sendMail(user.email, 'Restablecer la contraseña', 'forgot', bodyMail);
                return { statusCode: 200, mensaje: 'Se le envió un correo electrónico para cambiar la contraseña de su cuenta...' };
            }
        }
    } catch (error) {
        console.error('Failed to send email instructions:', error);
        return { statusCode: 500, mensaje: 'No se pudieron enviar instrucciones por correo electrónico. Por favor contacte con el administrador del sistema.' };
    }
}

export const recoveryPasswordUserService = async(params, body) => {
    try {
        const { token } = params;
        const { password, confirm_password } = body;

        if (password !== confirm_password) {
            return { statusCode: 404, mensaje: 'Las contraseñas no coinciden 😣' };
        }

        const user = await recoveryPasswordUserProvider(token);
        if (user) {
            try {
                let fechaActual = new Date();

                if (fechaActual <= user.caducidad_token) {
                    user.password = bcrypt.hashSync(password, 8)
                    user.token = null;
                    user.caducidad_token = null;
                    let userUpdate = await user.save();
                    if (userUpdate) {
                        let bodyMail = {
                            name: `${user.nombre} ${user.apellido}`,
                            username: user.email,
                            link: `${front}/auth/iniciarsesion`,
                            year: new Date().getFullYear()
                        }
                        if (process.env.NODE_ENV !== 'test') {
                            if (userUpdate) sendMail(user.email, `${user.nombre}, has cambiado exitosamente la contraseña de tu cuenta`, 'password_ok', bodyMail);
                        }
                        logger.info(`El usuario (${user.email}) ha cambiado la contraseña de su usuario con éxito`);
                        return { statusCode: 200, mensaje: 'Contraseña cambiada con éxito' }
                    } else {
                        return { statusCode: 400, mensaje: '¡No se pudo cambiar la contraseña! 😣' };
                    }
                } else {
                    let token = generateToken(60);
                    let link = `${front}/auth/recuperar-clave/${token}`;
                    let body = {
                        name: user.nombre,
                        username: user.email,
                        link: link,
                        year: new Date().getFullYear()
                    };
                    let horaActual = new Date();

                    user.token = token;
                    user.caducidad_token = horaActual.setMinutes(horaActual.getMinutes() + 60);
                    let userUpdate = await user.save();
                    if (userUpdate) {
                        sendMail(user.email, 'Restablecer la contraseña', 'forgot', body);
                        return { statusCode: 200, mensaje: 'Se le envió un correo electrónico para cambiar su cuenta de contraseña..' };
                    } else {
                        return { statusCode: 400, mensaje: 'No se pudo enviar para volver a olvidar la contraseña.' };
                    }
                }
            } catch (error) {
                logger.error('No se pudo actualizar el usuario:', error);
                return { statusCode: 500, mensaje: 'No se pudo actualizar el usuario' };
            }
        } else {
            return { statusCode: 400, mensaje: 'El token ingresado no es válido o no pertenece a ningún usuario.' };
        }
    } catch (error) {
        logger.error('No se pudo verificar el tokenn:', error);
        return { statusCode: 500, mensaje: 'No se pudo verificar el token' };
    }
}

export const refreshTokenUserService = async(body) => {
    try {
        const { oldToken } = body;
        const decoded = Jwt.verify(oldToken, secret);
        const userId = decoded.id;

        if (oldToken === null) {
            return { statusCode: 400, mensaje: 'El token no puede estar en blanco.' };;
        }

        const user = await refreshTokenUserProvider(userId);

        if (!user) {
            return { statusCode: 404, mensaje: 'Usuario no encontrado' };
        }

        let authorities = [];
        const roles = await user.getRols();

        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].nombre.toUpperCase());
        }

        let newToken = Jwt.sign({ id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, roles: authorities }, secret, { expiresIn: '2h' });

        return { statusCode: 200, mesagge: 'Se generó un nuevo token', refresh_token: newToken };

    } catch (error) {
        console.error('No se pudo renovar el token:', error);
        return { statusCode: 500, mensaje: 'No se pudo renovar el token' };
    }
}

export const reactiveUserService = async(body) => {
    try {
        const { email } = body;
        const user = await reactiveUserProvider(email);

        if (user.email_verified_at !== null) return { statusCode: 200, mensaje: 'Ya has verificado tu cuenta' }

        let token_user = generateToken(60);
        let link = `${front}/auth/verificar/${token_user}`;
        let fullName = `${user.nombre} ${user.apellido}`;
        let bodyMail = {
            name: fullName,
            link: link
        };
        let hoy = new Date();
        user.token = token_user;
        user.caducidad_token = hoy.setDate(hoy.getDate() + 1);
        let userUpdate = await user.save();
        if (userUpdate) {
            sendMail(user.email, 'Volver a verificar la dirección de correo electrónico', 'confirm', bodyMail);
            logger.info(`El usuario (${user.email} pidio re un link para volver a activar su cuenta)`);
            return { statusCode: 200, mensaje: "Se le envió un correo electrónico para confirmar su cuenta nuevamente porque su tiempo de gracia expiró." };
        } else {
            return { statusCode: 400, mensaje: "No se pudo enviar para volver a verificar la dirección de correo electrónico" }
        }
    } catch (error) {
        console.error('No se pudo verificar el token:', error);
        logger.error(`No se pudo volver a activar el usuario: ${error.meesage}`)
        return { statusCode: 500, mensaje: 'No se pudo volver a activar el usuario' };
    }
}

export const newPasswordUserService = async(params, body) => {
    try {
        const { token } = params;
        const { password, confirm_password } = body;

        if (password !== confirm_password) {
            return { statusCode: 404, mensaje: 'Las contraseñas no coinciden 😣' };
        }

        const user = await recoveryPasswordUserProvider(token);
        if (user) {
            try {
                let fechaActual = new Date();

                if (fechaActual <= user.caducidad_token) {
                    user.password = bcrypt.hashSync(password, 8)
                    user.token = null;
                    user.caducidad_token = null;
                    user.status = true;
                    let userUpdate = await user.save();
                    if (userUpdate) {
                        if (userUpdate) account_data(user, `${user.nombre}, estos son los datos de tu cuenta`)
                        return { statusCode: 200, message: 'Contraseña creada exitosamente para su cuenta. Por favor revisa tu correo electrónico para iniciar sesión' }
                    } else {
                        return { statusCode: 400, message: '¡No se pudo crear la contraseña! 😣' };
                    }
                } else {
                    let token = generateToken(60);
                    let link = `${front}/auth/nueva-clave/${token}`;
                    let bodyMail = {
                        name: user.nombre,
                        username: user.email,
                        link: link,
                        year: new Date().getFullYear()
                    };
                    let horaActual = new Date();

                    user.token = token;
                    user.caducidad_token = horaActual.setMinutes(horaActual.getMinutes() + 60);
                    let userUpdate = await user.save();
                    if (userUpdate) {
                        sendMail(user.email, 'Restablecer la contraseña', 'new_password', bodyMail);
                        return { statusCode: 200, message: 'Se le envió un correo electrónico para crear su cuenta de contraseña..' };
                    } else {
                        return { statusCode: 400, message: 'No se pudo enviar para volver a crear la contraseña' };
                    }
                }
            } catch (error) {
                console.error('No se pudo actualizar el usuario:', error);
                return { statusCode: 500, message: 'No se pudo actualizar el usuario' };
            }
        } else {
            return { statusCode: 400, message: 'El token ingresado no es válido o no pertenece a ningún usuario.' };
        }
    } catch (error) {
        console.error('No se pudo verificar el token:', error);
        return { statusCode: 500, message: 'No se pudo verificar el token' };
    }
}

const account_data = (user, subject) => {
    let link = `${front}/auth/iniciarsesion`;
    let bodyMail = {
        name: user.nombre,
        lastname: user.apellido,
        email: user.email,
        link: link,
        year: new Date().getFullYear()
    }

    sendMail(user.email, subject, 'account_data', bodyMail);

}