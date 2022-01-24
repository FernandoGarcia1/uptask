"use strict";

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy; // Referencia al Modelo donde vamos a autenticar


var Usuarios = require('../models/Usuarios'); // local strategy - Login con credenciales propios (usuario y password)


passport.use(new LocalStrategy( // por default passport espera un usuario y password
{
  usernameField: 'email',
  passwordField: 'password'
}, function _callee(email, password, done) {
  var usuario;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Usuarios.findOne({
            where: {
              email: email,
              activo: 1
            }
          }));

        case 3:
          usuario = _context.sent;

          if (usuario.verificarPassword(password)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", done(null, false, {
            message: 'Password Incorrecto'
          }));

        case 6:
          return _context.abrupt("return", done(null, usuario));

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", done(null, false, {
            message: 'Esa cuenta no existe'
          }));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
})); // serializar el usuario

passport.serializeUser(function (usuario, callback) {
  callback(null, usuario);
}); // deserializar el usuario

passport.deserializeUser(function (usuario, callback) {
  callback(null, usuario);
}); // exportar

module.exports = passport;