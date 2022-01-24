const express = require('express')
const router = express.Router(); 

//Importar express validator
const {body} = require('express-validator/check');

//Importat el controlador
const proyectoController = require ("../controllers/proyectoControllers.js")

const tareasController = require ("../controllers/tareasController.js")

const usuariosController = require('../controllers/usuariosController.js')

const authController = require ('../controllers/authControllers.js');

module.exports = function (){
    router.get('/' ,
        authController.usuarioAutenticado,
        proyectoController.paginaHome);
    router.get ('/nuevoProyecto',
        authController.usuarioAutenticado,
         proyectoController.formularioProyecto);
    router.post ('/nuevoProyecto', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),     //Se usa express validator, evaludando si es una cadena vacia, si no tiene espacios y si esta vacia
        proyectoController.nuevoProyecto);

    // Listar Proyectos
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,    
        proyectoController.proyectoUrl )

    //Actualizar el proyecto
    router.get('/proyecto/editar/:url', 
        authController.usuarioAutenticado,    
        proyectoController.formularioEditar);
    router.post ('/nuevoProyecto/:url', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),     //Se usa express validator, evaludando si es una cadena vacia, si no tiene espacios y si esta vacia
        proyectoController.actualizarProyecto);


    //Eliminarproyecto usando axios

    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectoController.eliminarProyecto);


    //tareas
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea);
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea);
    //Actualizar estado de la tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEdoTarea);
    //Eliminar Tarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea);



    //Crear cuenta

    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:email', usuariosController.confirmarCuenta);

    //iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //Ejemplo enlazar ruta
    router.get ('/nosotros',function(req, res){ res.send('Nosotros');});
    
    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //restablecer contraseña
    router.get('/restablecer', usuariosController.formRestablecerContraseña);
    router.post('/restablecer', authController.enviarToken);
    router.get('/restablecer/:token', authController.validarToken);
    router.post('/restablecer/:token', authController.cambiarContraseña)

    //Pagina not found
    //router.get('*', function(req, res){ res.send('La pagina no existe', 404); });


    return router;
}