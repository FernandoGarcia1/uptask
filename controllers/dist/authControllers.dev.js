"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var res = require('express/lib/response');

var passport = require('passport');

var Usuarios = require('../models/Usuarios.js');

var crypto = require('crypto');

var _require = require("sequelize"),
    Op = _require.Op;

var bcrypt = require('bcrypt-nodejs');

var enviarEmail = require('../handlers/email.js');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son necesarios'
});

exports.usuarioAutenticado = function (req, res, next) {
  //Si el usuario esta auteticado,manda al siguiente middleware
  if (req.isAuthenticated()) {
    return next();
  } //si no esta auteticado, redirige al formulario de inicio de sesion


  return res.redirect('/iniciar-sesion');
};

exports.cerrarSesion = function (req, res) {
  //cierra sesion
  req.logout(); //redirige a la pagina de iniciar sesion

  res.redirect('/iniciar-sesion');
};

exports.enviarToken = function _callee(req, res) {
  var email, usuario, resetUrl;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // verificar que el usuario existe
          email = req.body.email;
          _context.next = 3;
          return regeneratorRuntime.awrap(Usuarios.findOne({
            where: {
              email: email
            }
          }));

        case 3:
          usuario = _context.sent;

          // Si no existe el usuario
          if (!usuario) {
            req.flash('error', 'No existe esa cuenta');
            res.redirect('/restablecer');
          } // usuario existe


          usuario.token = crypto.randomBytes(20).toString('hex');
          usuario.expiracion = Date.now() + 3600000; // guardarlos en la base de datos

          _context.next = 9;
          return regeneratorRuntime.awrap(usuario.save());

        case 9:
          // url de reset
          resetUrl = "http://".concat(req.headers.host, "/restablecer/").concat(usuario.token); // Enviar el Correo con el Token

          _context.next = 12;
          return regeneratorRuntime.awrap(enviarEmail.enviar({
            usuario: usuario,
            subject: 'Password Reset',
            resetUrl: resetUrl,
            archivo: 'restablecer-contraseña',
            correcto: req.flash('correcto', 'Se envió un mensaje a tu correo'),
            url: res.redirect('/iniciar-sesion')
          }));

        case 12:
          // terminar
          req.flash('correcto', 'Se envió un mensaje a tu correo');

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.validarToken = function _callee2(req, res) {
  var token, usuario;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req);
          token = req.params.token;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Usuarios.findOne({
            where: {
              token: token
            }
          }));

        case 4:
          usuario = _context2.sent;

          if (!usuario) {
            req.flash('error', 'No valido');
            res.redirect('/restablecer');
          }

          console.log(usuario); // Formulario para generar la nueva contraseña

          res.render('nuevaContraseña', {
            tituloPagina: 'Restablecer Contraseña'
          });

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.cambiarContraseña = function _callee3(req, res, next) {
  var password, token, url, usuario, _usuario;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          password = req.body.password;
          token = req.params.token;
          url = "http://".concat(req.headers.host, "/restablecer/").concat(token);

          if (password.length < 4) {
            console.warn('Contraseña demadiado corta');
            req.flash('error', 'Contraseña demasiado corta. Debe tener almenos 4 caracteres.');
            res.render('nuevaContraseña', {
              tituloPagina: 'Restablece tu contraseña',
              mensajes: req.flash()
            });
            next();
          }

          _context3.next = 6;
          return regeneratorRuntime.awrap(Usuarios.findOne({
            where: {
              token: token,
              expiracion: _defineProperty({}, Op.gte, Date.now())
            }
          }));

        case 6:
          usuario = _context3.sent;
          console.log("El token es: " + token);

          if (usuario) {
            _context3.next = 19;
            break;
          }

          _context3.next = 11;
          return regeneratorRuntime.awrap(Usuarios.findOne({
            where: {
              token: token
            }
          }));

        case 11:
          _usuario = _context3.sent;
          console.log("El usuario es: " + _usuario.id);
          _usuario.token = null;
          _usuario.expiracion = null;
          _context3.next = 17;
          return regeneratorRuntime.awrap(_usuario.save());

        case 17:
          req.flash('error', 'Algo fallo. Vuelve a generar tu solicitud de cambio de contraseña.');
          res.redirect('/restablecer');

        case 19:
          if (!(password.length >= 4)) {
            _context3.next = 28;
            break;
          }

          console.log(usuario);
          usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
          usuario.token = null;
          usuario.expiracion = null;
          _context3.next = 26;
          return regeneratorRuntime.awrap(usuario.save());

        case 26:
          req.flash('correcto', 'Contraseña actualizada correctamente');
          res.redirect('/iniciar-sesion');

        case 28:
        case "end":
          return _context3.stop();
      }
    }
  });
};