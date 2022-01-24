const Sequelize = require ('sequelize');
const db = require('../config/db.js')
const Proyectos = require ('../models/Proyectos.js')

const Tareas = db.define('tareas', {
    id:{
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1),
});

Tareas.belongsTo(Proyectos); // Relaciona una tarea con un proyecto

module.exports = Tareas;
