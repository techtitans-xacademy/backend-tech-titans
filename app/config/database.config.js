import Sequelize from "sequelize";
import { config } from "dotenv";
config();


const uri = process.env.DB_URI || '';
const username = process.env.DB_USER || '';
const password = process.env.DB_PASS || '';
const database = process.env.DB_NAME || '';
const host = process.env.DB_HOST || '';
const port = process.env.DB_PORT || 0;
const dialect = process.env.DB_DIALECT || '';
const entorno = process.env.NODE_ENV || 'dev';

let configDB = {} || '';


switch (entorno) {
    case 'prod':
        configDB = uri;
        break;
    case 'dev':
        configDB = {
            database: database,
            username: username,
            password: password,
            host: host,
            dialect: dialect,
            port: port,
            ssl: true,
            logging: false,
        };
        break;
    case 'test':
        configDB = {
            dialect: 'sqlite',
            storage: './dbtest.sqlite',
            logging: false
        };
        break;
}


const sequelize = new Sequelize(configDB);

export default sequelize;