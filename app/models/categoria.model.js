import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Categoria = sequelize.define(
    "categoria", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        paranoid: true,
        timestamps: true,
        tableName: 'categorias'
    }
)

export default Categoria;