import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

// Importaciones de otros modelos
import Rol from "./rol.model.js";
import Usuario from "./usuario.model.js";

const Usuarios_roles = sequelize.define('usuarios_roles', {
    usuarioId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    rolId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Rol,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

export default Usuarios_roles;