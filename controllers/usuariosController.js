const res = require('express/lib/response');
const Usuarios = require('../models/Usuarios.js')
const enviarEmail = require('../handlers/email.js')


exports.formCrearCuenta =  (req,res)=>{
    res.render('crearCuenta',{
        tituloPagina: 'Crear cuenta en Up-Task'
    })
}

exports.crearCuenta = async (req,res, next)=>{

    const {email, password} = req.body;

    console.log(req.body)
    
    try {
        await Usuarios.create({
            email,password
        });

        //Crear URL de confirmacion
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto del usuario
        const usuario= {
            email
        }
        //enviar email

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta de UpTask', 
            confirmarUrl, 
            archivo : 'confirmar-cuenta',
            correcto: req.flash('correcto', '¡Cuenta creada, ahora puedes iniciar sesion!'),
            url: res.redirect('/iniciar-sesion')
        });
        //redirigir al usuario

        req.flash('correcto', 'Se ha mandando un email a tu correo');
        res.redirect('/iniciar-sesion')
    } catch (error) {
        console.log(error);
        req.flash('error', error.errors.map(error => error.message));

        res.render('crearCuenta', {
            mensajes: req.flash(),
            tituloPagina: 'Crear Cuenta en Up-Task',
            email
        })  
    }               
}

exports.formIniciarSesion =  (req,res)=>{
    const {error} = res.locals.mensajes
    res.render('iniciarSesion',{
        tituloPagina: 'Inicia sesión en Up-Task',
        error
    })
}

exports.formRestablecerContraseña= (req, res) =>{

    res.render('restablecerContraseña',{
        tituloPagina: 'Restablecer Contraseña'
    })
}

exports.confirmarCuenta = async(req, res) =>{
    const {email}= req.params
    const usuario = await Usuarios.findOne({
        where: {
            email:email
        }
    })
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta')
    };

    usuario.activo=1;
    await usuario.save();

    req.flash('correcto', 'Cuenta Activada correctamente');
    res.redirect('/iniciar-sesion')
}