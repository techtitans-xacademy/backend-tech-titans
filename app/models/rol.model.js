import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Rol = sequelize.define(
    "rol", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'roles'
    }
);
export default Rol;