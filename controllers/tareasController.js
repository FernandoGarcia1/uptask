const Proyectos = require('../models/Proyectos.js')
const Tareas = require('../models/Tareas.js')

const { send } = require("express/lib/response");

exports.agregarTarea = async (req,res, next) => {
    
    const proyecto = await Proyectos.findOne({
        where:{
            url: req.params.url
        }
    });

    if(!proyecto){
        return next();
        
    }   
    //leer el valor del input
    const {tarea}  = req.body;
    let errores=[];
    if(tarea === ""){
        
        errores.push("Ingresa el nombre de la tarea.")        
    }
    if(errores.length >0){
        res.redirect(`/proyectos/${req.params.url}`);
        return next();
    }
    //estado =0, tarea pendiente
    const estado=0;
    //obtener proyectoId
    const proyectoId= proyecto.id;

    const resultado = await Tareas.create({tarea,estado,proyectoId})

    if(!resultado){
        return next();
        
    }
    //rediccionar
    res.redirect(`/proyectos/${req.params.url}`)
    
};

exports.cambiarEdoTarea= async (req,res, next) =>{
    const {id} = req.params;
    console.log(id);
    const tarea = await Tareas.findOne({
        where: {
            id: id
        }
    });
    let estado =0;

    if(tarea.estado === estado){
        estado=1;
    }
    tarea.estado = estado;

    //actualizar dato en la BD
    const resultado = tarea.save();

    if(!resultado){
        return next();
    }
    res.status(200).send('Estado Actualizado')
};

exports.eliminarTarea = async (req, res, next) =>{
    const {id}= req.params
    const eliminar = await Tareas.destroy({
        where:{
            id:id
        }
    });

    if(!eliminar) return next();

    res.status(200).send('Tarea Eliminada Correctamente');

}