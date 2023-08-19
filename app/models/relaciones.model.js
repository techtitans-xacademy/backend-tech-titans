import Curso from "./curso.model.js";
import Docente from "./docente.model.js";
import Usuario from "./usuario.model.js";
import Usuarios_roles from "./usuarios_roles.model.js";
import Asistencia from "./asistencia.model.js";
import Rol from "./rol.model.js";
import Pago from "./pago.model.js";


// Relation N:N Usuario-Rol
Usuario.belongsToMany(Rol, {
    through: Usuarios_roles,
    foreignKey: 'usuarioId',
    otherKey: 'rolId'
});

Rol.belongsToMany(Usuario, {
    through: Usuarios_roles,
    foreignKey: 'rolId',
    otherKey: 'usuarioId'
});


// Relation 1:N Usuario - Curso
Usuario.hasMany(Curso, {
    foreinkey: "usuario_id",
    sourceKey: "id",
});

Curso.belongsTo(Usuario, { foreinkey: "usuario_id", targetId: "id" });

// Relation 1:N Docente - Curso
Docente.hasMany(Curso, {
    foreinkey: "docente_id",
    sourceKey: "id",
});

Curso.belongsTo(Docente, { foreinkey: "docente_id", targetId: "id" });

// Relation 1:N Curso - Asistencia
Curso.hasMany(Asistencia, {
    foreinkey: "curso_id",
    sourceKey: "id",
});

Asistencia.belongsTo(Curso, { foreinkey: "curso_id", targetId: "id" });

// Relation 1:N Usuario - Asistencia
Usuario.hasMany(Asistencia, {
    foreinkey: "usuario_id",
    sourceKey: "id",
});

Asistencia.belongsTo(Usuario, { foreinkey: "usuario_id", targetId: "id" });

// Relation 1:N Usuario - Pago
Usuario.hasMany(Pago, {
    foreinkey: "usuario_id",
    sourceKey: "id",
});

Pago.belongsTo(Usuario, { foreinkey: "usuario_id", targetId: "id" });