import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Pago = sequelize.define(
    "pago", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        pago: {
            type: DataTypes.BOOLEAN,
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
        tableName: 'pagos'
    }
);
export default Pago;