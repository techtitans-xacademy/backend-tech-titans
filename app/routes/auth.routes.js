import { Router } from "express";
import { checkDuplicateEmail, checkRolesExisted, checkValidEmail } from "../middlewares/register.middleware.js";
import { forgotPasswordUser, loginUser, newPasswordUser, reactiveUser, recoveryPasswordUser, refreshTokenUser, registerUser, verifyNewUser, verifyUser } from "../controllers/auth.controllers.js";
import { forgot_password, login_user, recovery_pass, refresh_token, register_user } from "../validations/auth.validations.js";
import { isAdmin, isLogged } from "../middlewares/verifyUser.middleware.js";



const router = Router();

router.post("/registrarme", [
    checkDuplicateEmail,
    checkRolesExisted,
    checkValidEmail
], register_user, registerUser);

router.get('/verificar/:token', verifyUser);

router.get('/nueva-cuenta/verificar/:token', verifyNewUser)

router.post('/iniciarsesion', login_user, loginUser)

router.post('/olvide-clave', [checkValidEmail], forgot_password, forgotPasswordUser)

router.post('/recuperar-clave/:token', recovery_pass, recoveryPasswordUser)

router.post('/nueva-clave/:token', recovery_pass, newPasswordUser);

router.post('/refresh-token', [isLogged], refresh_token, refreshTokenUser)

router.post('/reactivar-cuenta', [checkValidEmail], forgot_password, reactiveUser);

export default router;