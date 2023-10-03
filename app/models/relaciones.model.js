import Curso from "./curso.model.js";
import Docente from "./docente.model.js";
import Usuario from "./usuario.model.js";
import Usuarios_roles from "./usuarios_roles.model.js";
import Asistencia from "./asistencia.model.js";
import Rol from "./rol.model.js";
import Pago from "./pago.model.js";
import Categoria from "./categoria.model.js";


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
    foreignKey: "usuarioId",
    sourceKey: "id",
});

Curso.belongsTo(Usuario, { foreignKey: "usuarioId", targetId: "id", as: 'usuario' });

// Misma relacion de 1:N Usuario - Curso pero llamado docenteId
Usuario.hasMany(Curso, {
    foreignKey: "docenteId",
    sourceKey: "id",
});

Curso.belongsTo(Usuario, { foreignKey: "docenteId", targetId: "id", as: 'docente' });

// Relation 1:N Categoria - Curso
Categoria.hasMany(Curso, {
    foreignKey: "categoriaId",
    sourceKey: "id"
});

Curso.belongsTo(Categoria, { foreignKey: "categoriaId", targetId: "id", as: 'categoria' });

// Relation 1:N Usuario - Categoria
Usuario.hasMany(Categoria, {
    foreignKey: "usuarioId",
    sourceKey: "id",
});

Categoria.belongsTo(Usuario, { foreignKey: "usuarioId", targetId: "id" });

// Relation 1:N Curso - Asistencia
Curso.hasMany(Asistencia, {
    foreignKey: "cursoId",
    sourceKey: "id",
});

Asistencia.belongsTo(Curso, { foreignKey: "cursoId", targetId: "id", as: "curso" });

// Relation 1:N Usuario - Asistencia - como docente
Usuario.hasMany(Asistencia, {
    foreignKey: "docenteId",
    sourceKey: "id",
});

Asistencia.belongsTo(Usuario, { foreignKey: "docenteId", targetId: "id", as: "docente" });

// Relation 1:N Usuario - Asistencia - como estudiante
Usuario.hasMany(Asistencia, {
    foreignKey: "estudianteId",
    sourceKey: "id",
});

Asistencia.belongsTo(Usuario, { foreignKey: "estudianteId", targetId: "id", as: "estudiante" });

// Relation 1:N Usuario - Pago
Usuario.hasMany(Pago, {
    foreignKey: "usuarioId",
    sourceKey: "id",
});

Pago.belongsTo(Usuario, { foreignKey: "usuarioId", targetId: "id" });

// Relation 1:1 Asistencia - Pago
Asistencia.hasOne(Pago, {
    foreignKey: "inscripcionId",
    sourceKey: "id",
});

Pago.belongsTo(Asistencia, { foreignKey: "inscripcionId", targetId: "id", as: "inscripcion" });

// Relation 1:N Usuario - Docente
Usuario.hasMany(Docente, {
    foreignKey: "usuarioId",
    sourceKey: "id",
});

Docente.belongsTo(Usuario, { foreignKey: "usuarioId", targetId: "id" });