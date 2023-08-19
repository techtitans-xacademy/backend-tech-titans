import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Asistencia = sequelize.define("asistencia", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    asistio: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    puntaje: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    paranoid: true,
    timestamps: true,
    tableName: 'asistencias'
});

export default Asistencia;