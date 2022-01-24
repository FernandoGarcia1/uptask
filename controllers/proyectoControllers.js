const Proyectos = require('../models/Proyectos.js');
const Tareas = require('../models/Tareas.js')
const Usuarios = require('../models/Usuarios.js');
const slug = require('slug');
const res = require('express/lib/response');



exports.paginaHome =async (req, res) => {
    
    const usuarioId = res.locals.usuario.id;    

    const proyectos = await Proyectos.findAll({
        where:{
            usuarioId: usuarioId
        }
    });    

    
    
    res.render ('index', {
        tituloPagina: 'Proyectos',
        proyectos
    });
};

exports.formularioProyecto = async (req, res) =>{
    
    const usuarioId = res.locals.usuario.id;
    
    const proyectos = await Proyectos.findAll({
        where:{
            usuarioId: usuarioId
        }
    });
    
    
    res.render('nuevoProyecto', {
        tituloPagina: 'Nuevo Proyecto',
        proyectos
    })
};

exports.nuevoProyecto = async(req, res) =>{
    const {nombre} = req.body;
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({
        where:{
            usuarioId: usuarioId
        }
    });
    let errores = [];

    if (nombre == ""){
        errores.push({'texto' : "Agrega un nombre a tu proyecto"})
    }
    if (errores.length > 0){
        res.render('nuevoProyecto', {
            tituloPagina: 'Nuevo Proyecto',
            proyectos,
            errores
        })
    }else {
        const Proyecto  = await Proyectos.create({
            nombre,
            usuarioId
        })
        res.redirect('/');                
    }    
}
exports.proyectoUrl = async (req,res, next) =>{

    const usuarioId = res.locals.usuario.id;
    
    const proyectosPromise =  Proyectos.findAll({
        where:{
            usuarioId: usuarioId
        }
    });

    const proyectoPromise =  Proyectos.findOne({
        where: {
            url: req.params.url  //consulta que regresa el proyecto segun la url
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);
    

    const tareas = await Tareas.findAll({  //Obtiene todas las tareas de un proyecto
        where:{
            proyectoId: proyecto.id
        }
    });

    

    if (!proyecto) return next(); //Si no existe el prpyecto se salta al siguiente middlewhere

    res.render('tareas', {
        tituloPagina: 'Tareas del Proyecto',
        proyectos,
        proyecto,
        tareas
    })
}

exports.formularioEditar = async (req, res, next) =>{
    const usuarioId = res.locals.usuario.id;
    
    const proyectosPromise =  Proyectos.findAll({
        where:{
            usuarioId: usuarioId
        }
    });
   
    const proyectoPromise =  Proyectos.findOne({
        where: {
            url: req.params.url  //consulta que regresa el proyecto segun la url
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    if (!proyecto) return next(); //Si no existe el prpyecto se salta al siguiente middlewhere

    

    res.render('nuevoProyecto', {
        tituloPagina: `Editar`,
        proyectos,      
        proyecto
    })

}

exports.actualizarProyecto = async(req, res) =>{
    const {nombre} = req.body;
    const usuarioId = res.locals.usuario.id;
    
    const proyectos = await Proyectos.findAll({
        where:{
            usuarioId: usuarioId
        }
    });
    let errores = [];

    if (nombre == ""){
        errores.push({'texto' : "Agrega un nombre a tu proyecto"})
    }
    if (errores.length > 0){
        res.render('nuevoProyecto', {
            tituloPagina: 'Nuevo Proyecto',
            proyectos,
            errores
        })
    }else {
        await Proyectos.update(
            {nombre: nombre},
            {where:
                {url: req.params.url}
            })
        res.redirect('/');                
    }    
}

exports.eliminarProyecto= async (req, res, next) =>{
    //req, query o params
    
    console.log(req.params)
    const {url} = req.params;
    console.log(url)
    const resultado = await Proyectos.destroy({where:
        {url: url}
    });

    if(!resultado){
        
        return next();
    }

    res.status(200).send("Proyecto Eliminado Correctamente")
}

//Ejemplo ´de crear Ruta
exports.paginaNosotros= (req, res ) =>{
    res.render('nosotros',{
        tituloPagina: 'Proyectos'
    });
};

