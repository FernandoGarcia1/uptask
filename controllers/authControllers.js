const res = require('express/lib/response');
const passport = require('passport');
const Usuarios = require('../models/Usuarios.js');
const crypto = require('crypto')
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs')
const enviarEmail = require('../handlers/email.js')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son necesarios'
});
 
exports.usuarioAutenticado = (req, res, next) =>{
    //Si el usuario esta auteticado,manda al siguiente middleware
    if(req.isAuthenticated()){
        return next();
    }
    //si no esta auteticado, redirige al formulario de inicio de sesion
    return res.redirect('/iniciar-sesion')
}

exports.cerrarSesion = (req, res) =>{
    //cierra sesion
    req.logout();

    //redirige a la pagina de iniciar sesion

    res.redirect('/iniciar-sesion');
}

exports.enviarToken = async (req, res) => {
    // verificar que el usuario existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: { email }});

    // Si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/restablecer');
    }

    // usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // guardarlos en la base de datos
    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

    // Enviar el Correo con el Token

    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset', 
        resetUrl, 
        archivo : 'restablecer-contraseña',
        correcto: req.flash('correcto', 'Se envió un mensaje a tu correo'),
        url: res.redirect('/iniciar-sesion')
    });

    // terminar
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    
}

exports.validarToken = async(req, res) =>{
    console.log(req)
    const {token} = req.params

    const usuario= await Usuarios.findOne({
        where:{
            token:token
        }
    });

    if(!usuario){
        req.flash('error', 'No valido')
        res.redirect('/restablecer');
    }
    console.log(usuario)

    // Formulario para generar la nueva contraseña

    res.render('nuevaContraseña', {
        tituloPagina: 'Restablecer Contraseña'
    });
}

exports.cambiarContraseña = async (req, res, next) =>{
    const {password} = req.body;
    const {token} = req.params
    const url= `http://${req.headers.host}/restablecer/${token}`;

    if(password.length <4){
        console.warn('Contraseña demadiado corta')
        req.flash('error', 'Contraseña demasiado corta. Debe tener almenos 4 caracteres.');
        res.render('nuevaContraseña',{
            tituloPagina:'Restablece tu contraseña',
            mensajes: req.flash()

        });
        next();
        
    }
    
    const usuario = await Usuarios.findOne({
        where:{
            token: token,
            expiracion:{
                [Op.gte]: Date.now()
            }
        }
    })
    console.log("El token es: "+ token)

    if(!usuario){
        const usuario = await Usuarios.findOne({
            where:{
                token: token
            }
        })
        
        console.log("El usuario es: "+ usuario.id);
        usuario.token= null;
        usuario.expiracion= null;
        await usuario.save();
        req.flash('error', 'Algo fallo. Vuelve a generar tu solicitud de cambio de contraseña.');
        res.redirect('/restablecer');
    }
    if(password.length >=4){
        console.log(usuario);
        usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
        usuario.token= null;
        usuario.expiracion= null;
        await usuario.save();

        req.flash('correcto', 'Contraseña actualizada correctamente');
        res.redirect('/iniciar-sesion')
    }
    

}