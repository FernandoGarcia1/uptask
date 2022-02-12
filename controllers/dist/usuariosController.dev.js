"use strict";

var res = require('express/lib/response');

var Usuarios = require('../models/Usuarios.js');

var enviarEmail = require('../handlers/email.js');

exports.formCrearCuenta = function (req, res) {
  res.render('crearCuenta', {
    tituloPagina: 'Crear cuenta en Up-Task'
  });
};

exports.crearCuenta = function _callee(req, res, next) {
  var _req$body, email, password, confirmarUrl, usuario;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          console.log(req.body);
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(Usuarios.create({
            email: email,
            password: password
          }));

        case 5:
          //Crear URL de confirmacion
          confirmarUrl = "http://".concat(req.headers.host, "/confirmar/").concat(email); //crear el objeto del usuario

          usuario = {
            email: email
          }; //enviar email

          _context.next = 9;
          return regeneratorRuntime.awrap(enviarEmail.enviar({
            usuario: usuario,
            subject: 'Confirma tu cuenta de UpTask',
            confirmarUrl: confirmarUrl,
            archivo: 'confirmar-cuenta',
            correcto: req.flash('correcto', '¡Cuenta creada, ahora puedes iniciar sesion!'),
            url: res.redirect('/iniciar-sesion')
          }));

        case 9:
          //redirigir al usuario
          req.flash('correcto', 'Se ha mandando un email a tu correo');
          res.redirect('/iniciar-sesion');
          _context.next = 18;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](2);
          console.log(_context.t0);
          req.flash('error', _context.t0.errors.map(function (error) {
            return error.message;
          }));
          res.render('crearCuenta', {
            mensajes: req.flash(),
            tituloPagina: 'Crear Cuenta en Up-Task',
            email: email
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 13]]);
};

exports.formIniciarSesion = function (req, res) {
  var error = res.locals.mensajes.error;
  res.render('iniciarSesion', {
    tituloPagina: 'Inicia sesión en Up-Task',
    error: error
  });
};

exports.formRestablecerContraseña = function (req, res) {
  res.render('restablecerContraseña', {
    tituloPagina: 'Restablecer Contraseña'
  });
};

exports.confirmarCuenta = function _callee2(req, res) {
  var email, usuario;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          email = req.params.email;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Usuarios.findOne({
            where: {
              email: email
            }
          }));

        case 3:
          usuario = _context2.sent;

          if (!usuario) {
            req.flash('error', 'No valido');
            res.redirect('/crear-cuenta');
          }

          ;
          usuario.activo = 1;
          _context2.next = 9;
          return regeneratorRuntime.awrap(usuario.save());

        case 9:
          req.flash('correcto', 'Cuenta Activada correctamente');
          res.redirect('/iniciar-sesion');

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
};