const express = require ('express');
const routes = require('./routes/index.js')
const path = require ('path')
const bodyParser = require('body-parser'); //Sirve para leer respuestas de un formulario

const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport.js');

require('dotenv').config({path: 'variables.env'})


//Crear la conexion a la base de datos

const db = require('./config/db.js')

//importar y crear  el modelo
require('./models/Proyectos.js')
require('./models/Tareas.js')
require('./models/Usuarios.js')

//helpers con algunas funciones
const helpers = require('./helpers.js')

db.sync() //Crea la tabla definida en el modelo
    .then(() => console.log("Base de datos conectada"))
    .catch( (error) => console.log("Error al conectar la base de datos: " + error));


//crear APP

const app = express();

//Habilitar body parser

app.use(bodyParser.urlencoded({extended: true}));


//Agregamos express validator




//habilitar pug

app.set('view engine', 'pug')

//Añadir carpetas de vistas

app.set('views', path.join(__dirname, './views'));


//Agregamos flash (sirve para mostrar mensajes)

app.use(flash());

app.use(cookieParser());

//Permite mantener una sesion iniciada entre distintas paginas
app.use(session({
    secret:'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session()); 

//pasar vardump (convertir objeto en json)
app.use((req, res, next) =>{
    //console.log(req.user); req.user // Guarda  la informacion del usuario authenticado
    res.locals.vardump = helpers.vardump; //reslocal crea la variable vardump la cual estara disponible en todo el proyecto
    res.locals.mensajes= req.flash();
    res.locals.usuario= {...req.user} || null;
    
    next();
})



//archivos estatiticos

app.use(express.static('public'))

//rutas

app.use('/', routes());

/*app.use((req, res) =>{
    res.status(404).send('La pagina no existe')
})*/

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

app.listen(port,host, () =>{
    console.log("Escuchando en el puerto 5000");
});

//require ('./handlers/email.js')