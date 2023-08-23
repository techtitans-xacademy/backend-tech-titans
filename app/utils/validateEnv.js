import { cleanEnv, str, bool, port, host, num, email, json } from 'envalid'

const validate = cleanEnv(process.env, {
    APP: str(),
    API_PORT: port(),
    API_HOST: host(),
    NODE_ENV: str({ choices: ['dev', 'prod', 'test'] }),
    DB_URI: str(),
    DB_HOST: host(),
    DB_PORT: port(),
    DB_USER: str(),
    DB_PASS: str(),
    DB_NAME: str(),
    DB_DIALECT: str(),
    SSL: bool(),
    LOG_LEVEL: str({ choices: ['debug', 'info', 'error'] }),
    HOST_FRONT: str(),
    HOST_FRONT_EMAIL: str(),
    JWT_SECRET: str(),
    API_PROTOCOL: str(),
    NAME_MAIL: str(),
    USER_MAIL: str(), //email()
    PASS_MAIL: str(),
    TZ: str(),
    CLOUDINARY_API_KEY: str(),
    CLOUDINARY_API_SECRET: str(),
    CLOUDINARY_NAME: str(),
    PAGE_SIZE: num()
});

export default validate;