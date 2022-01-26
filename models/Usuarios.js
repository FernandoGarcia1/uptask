const Sequelize = require('sequelize');
const db = require('../config/db.js');
const Proyectos = require('../models/Proyectos.js')
const bcrypt = require('bcrypt-nodejs')


const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false, //No acepta entradas en blanco
        validate: {
            notEmpty:{
                msg: 'Agrega un correo'
            },
            isEmail:{
                msg:'Agrega un correo valido.' //SI el dato ingresado no es uun email manda este mensaje.
            }
        }, unique:{
                args: true,
                msg: 'Usuario Ya registrado.'
        }

    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false, //No acepta entradas en blanco
        validate:{
            notEmpty:{
                msg: 'Agrega tu contraseña'
            },
            len: {
                args: [4,60],
                msg: "Contraseña demasiado corta. Coloca minimo 4 caracteres."
           }
        }                        
    },
    activo:{
        type:Sequelize.INTEGER,
        defaultValue: 1,
    },
    token: {
        type: Sequelize.STRING
    },
    expiracion: {
        type: Sequelize.DATE
    }

},{
    hooks:{
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10)); //Hashear contraseñas
        }
    }
},
);

//metodos personalizados, con prototype permite que todos los objetos creados tipo Usuario tengan la funcion definida
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;