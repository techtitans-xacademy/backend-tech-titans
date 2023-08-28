import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Curso = sequelize.define(
    "curso", {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        portada: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        public_id: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        dia_curso: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        hora_curso: {
            type: DataTypes.TIME,
            allowNull: false
        },
        duracion: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        precio: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: false
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    }, {
        paranoid: true,
        timestamps: true
    }
)

export default Curso;