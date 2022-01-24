"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var routes = require('./routes/index.js');

var path = require('path');

var bodyParser = require('body-parser'); //Sirve para leer respuestas de un formulario


var flash = require('connect-flash');

var session = require('express-session');

var cookieParser = require('cookie-parser');

var passport = require('./config/passport.js');

require('dotenv').config({
  path: 'variables.env'
}); //Crear la conexion a la base de datos


var db = require('./config/db.js'); //importar y crear  el modelo


require('./models/Proyectos.js');

require('./models/Tareas.js');

require('./models/Usuarios.js'); //helpers con algunas funciones


var helpers = require('./helpers.js');

db.sync() //Crea la tabla definida en el modelo
.then(function () {
  return console.log("Base de datos conectada");
})["catch"](function (error) {
  return console.log("Error al conectar la base de datos: " + error);
}); //crear APP

var app = express(); //Habilitar body parser

app.use(bodyParser.urlencoded({
  extended: true
})); //Agregamos express validator
//habilitar pug

app.set('view engine', 'pug'); //Añadir carpetas de vistas

app.set('views', path.join(__dirname, './views')); //Agregamos flash (sirve para mostrar mensajes)

app.use(flash());
app.use(cookieParser()); //Permite mantener una sesion iniciada entre distintas paginas

app.use(session({
  secret: 'supersecreto',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); //pasar vardump (convertir objeto en json)

app.use(function (req, res, next) {
  //console.log(req.user); req.user // Guarda  la informacion del usuario authenticado
  res.locals.vardump = helpers.vardump; //reslocal crea la variable vardump la cual estara disponible en todo el proyecto

  res.locals.mensajes = req.flash();
  res.locals.usuario = _objectSpread({}, req.user) || null;
  next();
}); //archivos estatiticos

app.use(express["static"]('public')); //rutas

app.use('/', routes());
/*app.use((req, res) =>{
    res.status(404).send('La pagina no existe')
})*/

var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 5000;
app.listen(port, host, function () {
  console.log("Escuchando en el puerto 5000");
}); //require ('./handlers/email.js')