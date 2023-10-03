import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Asistencia = sequelize.define("asistencia", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    codigoInscripcion: {
        type: DataTypes.STRING(36),
        allowNull: true,
    },
    asistio: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    puntaje: {
        type: DataTypes.ENUM(['No calificado', 'Desaprobado', 'Aprobado']),
        allowNull: false,
        defaultValue: 'No calificado'
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