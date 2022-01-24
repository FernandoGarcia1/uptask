const Sequelize = require('sequelize');

const db = require('../config/db.js');
const slug = require('slug');
const shortid = require('shortid'); //Genera un id unico

const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.TEXT,
    url: Sequelize.STRING
    },{
        hooks: {
            beforeCreate(proyecto){ //Obtiene los datos que se insertaran en la base de datos, antes de que sean insertados
                const url= slug(proyecto.nombre).toLowerCase(); //Consulta lo que se le agregara a la base en nombre y lo convierte a una cadena para la url
                proyecto.url=`${url}-${shortid.generate()}`; //Inserta la url a la query de insercion
            }
        }
    });

module.exports = Proyectos;