import sequelize from "../config/database.config.js";
import Rol from '../models/rol.model.js';
import Usuario from '../models/usuario.model.js';
import { config } from "dotenv";
import { logger } from "../utils/winston.logger.js";
import { sendMail } from "../mails/config.mails.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken } from "../helpers/generateTokens.helpers.js";
config();

const front = process.env.HOST_FRONT_EMAIL;
const secret = process.env.JWT_SECRET || "";

const Op = sequelize.Sequelize.Op;


export const registerUserProvider = async(usuario, rolesServ) => {
    try {
        const user = await Usuario.create(usuario);
        let userRoles = [];

        if (rolesServ) {
            userRoles = await Rol.findAll({
                where: {
                    nombre: {
                        [Op.or]: rolesServ
                    }
                }
            });
        } else {
            // user role = 3
            const rol = await Rol.findByPk(3);
            userRoles.push(rol);
        }

        if (user) {
            await user.setRols(userRoles);
            logger.info(`El usuario con el email: ${usuario.email} ha creado un nuevo usuario.`);

            let bodyMail = {
                name: `${usuario.nombre} ${usuario.apellido}`,
                link: `${front}/auth/verificar/${usuario.token}`
            };

            sendMail(usuario.email, `${usuario.nombre}, por favor verifique su dirección de correo electrónico`, 'confirm', bodyMail);
            return { statusCode: 201, mensaje: "¡El usuario se registró exitosamente! Por favor revise su correo electrónico para verificar su cuenta." };
        } else {
            logger.error(`No se ha podido registrar el usuario.`);
            return { statusCode: 400, mensaje: 'No se ha podido registrar el usuario.' }
        }
    } catch (err) {
        console.error('Hubo un error al querer registrar un usuario: ', err);
        logger.error('Hubo un error al querer registrar un usuario: ', err);
        return { statusCode: 500, mensaje: 'Hubo un error al querer registrar un usuario' };
    }
}

export const verifyUserProvider = async(token) => {
    try {
        const user = await Usuario.findOne({
            where: { token }
        });

        if (!user) return { statusCode: 404, mensaje: 'No se encontró ningún usuario con el token ingresado' };
        if (user.email_verified_at != null) return { statusCode: 200, mensaje: "Correo electrónico ya verificado" };

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
                console.error('No se pudo actualizar el usuario:', error);
                return { statusCode: 500, mensaje: 'No se pudo actualizar el usuario' };
            }
        } else {
            return { statusCode: 404, mensaje: 'No se encontró ningún usuario con el token ingresado' };
        }
    } catch (err) {
        console.error('Hubo un error al querer verificar un usuario: ', err.message);
        logger.error('Hubo un error al querer verificar un usuario: ', err.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer verificar un usuario' };
    }
}

export const verifyNewUserProvider = async(token) => {
    try {
        const user = await Usuario.findOne({
            where: { token }
        });
        if (user.email_verified_at !== null) return { statusCode: 200, mensaje: "Correo electrónico ya verificado" };

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
                        return { statusCode: 200, mensaje: "¡Cuenta verificada exitosamente!" };
                    } else {
                        return { statusCode: 400, mensaje: "No se pudo verificar la cuenta" };
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
                        return { statusCode: 200, mensaje: "Se le envió un correo electrónico para confirmar su cuenta nuevamente porque su tiempo de gracia expiró." };
                    } else {
                        return { statusCode: 400, mensaje: "No se pudo enviar para volver a verificar la cuenta" };
                    }
                }
            } catch (error) {
                console.error('No se pudo actualizar el usuario:', error);
                logger.error('No se pudo actualizar el usuario:', error);
                return { statusCode: 500, mensaje: 'No se pudo actualizar el usuario' };
            }
        } else {
            return { statusCode: 404, mensaje: 'No se encontró ningún usuario con el token ingresado' };
        }
    } catch (err) {
        console.error('No se pudo verificar el token:', err.message);
        return { statusCode: 500, mensaje: 'No se pudo verificar el token' };
    }
}

export const loginUserProvider = async(email, password) => {
    try {
        const user = await Usuario.findOne({
            where: { email }
        });
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
            mensaje: 'Has iniciado sesion con éxito',
            // user: {
            //     id: user.id,
            //     nombre: user.nombre,
            //     apellido: user.apellido,
            //     email: user.email,
            //     roles: authorities,
            // },
            accessToken: token
        };
    } catch (err) {
        console.error('Hubo un error al querer iniciar sesion: ', err.message);
        logger.error('Hubo un error al querer iniciar sesion: ', err.message);
        return { statusCode: 500, mensaje: 'Hubo un error al querer iniciar sesion' };
    }
}

export const forgotPasswordUserProvider = async(email) => {
    try {
        const user = await Usuario.findOne({
            where: { email },
        });
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
    } catch (err) {
        console.error('No se pudieron enviar instrucciones por correo electrónico:', err.message);
        logger.error('No se pudieron enviar instrucciones por correo electrónico:', err.message);
        return { statusCode: 500, mensaje: 'No se pudieron enviar instrucciones por correo electrónico. Por favor contacte con el administrador del sistema.' };
    }
}

export const recoveryPasswordUserProvider = async(token, password) => {
    try {
        const user = await Usuario.findOne({
            where: { token }
        });
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
            } catch (err) {
                logger.error('No se pudo actualizar el usuario:', err.message);
                return { statusCode: 500, mensaje: 'No se pudo actualizar el usuario' };
            }
        } else {
            return { statusCode: 400, mensaje: 'El token ingresado no es válido o no pertenece a ningún usuario.' };
        }
    } catch (err) {
        logger.error('No se pudo verificar el tokenn:', err.message);
        return { statusCode: 500, mensaje: 'No se pudo verificar el token' };
    }
}

export const refreshTokenUserProvider = async(id) => {
    try {
        const user = await Usuario.findOne({
            where: {
                id
            }
        });

        if (!user) {
            return { statusCode: 404, mensaje: 'Usuario no encontrado' };
        }

        let authorities = [];
        const roles = await user.getRols();

        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].nombre.toUpperCase());
        }

        let newToken = Jwt.sign({ id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, roles: authorities }, secret, { expiresIn: '2h' });

        return { statusCode: 200, mensaje: 'Se generó un nuevo token', refresh_token: newToken };
    } catch (err) {
        console.error('No se pudo renovar el token:', err.mesagge);
        logger.error('No se pudo renovar el token:', err.mesagge);
        return { statusCode: 500, mensaje: 'No se pudo renovar el token' };
    }
}

export const reactiveUserProvider = async(email) => {
    try {
        const user = await Usuario.findOne({
            where: { email },
        });

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
    } catch (err) {
        console.error('No se pudo verificar el token:', err.message);
        logger.error(`No se pudo volver a activar el usuario: ${err.meesage}`)
        return { statusCode: 500, mensaje: 'No se pudo volver a activar el usuario' };
    }
}

export const newPasswordUserProvider = async(token, password) => {
    try {
        const user = await Usuario.findOne({
            where: { token }
        });
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
                        return { statusCode: 200, mensaje: 'Contraseña creada exitosamente para su cuenta. Por favor revisa tu correo electrónico para iniciar sesión' }
                    } else {
                        return { statusCode: 400, mensaje: '¡No se pudo crear la contraseña! 😣' };
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
                        return { statusCode: 200, mensaje: 'Se le envió un correo electrónico para crear su cuenta de contraseña..' };
                    } else {
                        return { statusCode: 400, mensaje: 'No se pudo enviar para volver a crear la contraseña' };
                    }
                }
            } catch (err) {
                console.error('No se pudo actualizar el usuario:', err.message);
                return { statusCode: 500, mensaje: 'No se pudo actualizar el usuario' };
            }
        } else {
            return { statusCode: 400, mensaje: 'El token ingresado no es válido o no pertenece a ningún usuario.' };
        }
    } catch (err) {
        console.error('No se pudo verificar el token:', err.message);
        return { statusCode: 500, mensaje: 'No se pudo verificar el token' };
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