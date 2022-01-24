"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Proyectos = require('../models/Proyectos.js');

var slug = require('slug');

var res = require('express/lib/response');

exports.paginaHome = function _callee(req, res) {
  var proyectos;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Proyectos.findAll());

        case 2:
          proyectos = _context.sent;
          res.render('index', {
            tituloPagina: 'Proyectos',
            proyectos: proyectos
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.formularioProyecto = function _callee2(req, res) {
  var proyectos;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Proyectos.findAll());

        case 2:
          proyectos = _context2.sent;
          res.render('nuevoProyecto', {
            tituloPagina: 'Nuevo Proyecto',
            proyectos: proyectos
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.nuevoProyecto = function _callee3(req, res) {
  var nombre, proyectos, errores, Proyecto;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          nombre = req.body.nombre;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Proyectos.findAll());

        case 3:
          proyectos = _context3.sent;
          errores = [];

          if (nombre == "") {
            errores.push({
              'texto': "Agrega un nombre a tu proyecto"
            });
          }

          if (!(errores.length > 0)) {
            _context3.next = 10;
            break;
          }

          res.render('nuevoProyecto', {
            tituloPagina: 'Nuevo Proyecto',
            proyectos: proyectos,
            errores: errores
          });
          _context3.next = 14;
          break;

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(Proyectos.create({
            nombre: nombre
          }));

        case 12:
          Proyecto = _context3.sent;
          res.redirect('/');

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.proyectoUrl = function _callee4(req, res, next) {
  var proyectos, proyecto;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Proyectos.findAll());

        case 2:
          proyectos = _context4.sent;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Proyectos.findOne({
            where: {
              url: req.params.url //consulta que regresa el proyecto segun la url

            }
          }));

        case 5:
          proyecto = _context4.sent;

          if (proyecto) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", next());

        case 8:
          //Si no existe el prpyecto se salta al siguiente middlewhere
          res.render('tareas', {
            tituloPagina: 'Tareas del Proyecto',
            proyectos: proyectos,
            proyecto: proyecto
          });

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.formularioEditar = function _callee5(req, res, next) {
  var proyectosPromise, proyectoPromise, _ref, _ref2, proyectos, proyecto;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          proyectosPromise = Proyectos.findAll();
          proyectoPromise = Proyectos.findOne({
            where: {
              url: req.params.url //consulta que regresa el proyecto segun la url

            }
          });
          _context5.next = 4;
          return regeneratorRuntime.awrap(Promise.all([proyectosPromise, proyectoPromise]));

        case 4:
          _ref = _context5.sent;
          _ref2 = _slicedToArray(_ref, 2);
          proyectos = _ref2[0];
          proyecto = _ref2[1];

          if (proyecto) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", next());

        case 10:
          //Si no existe el prpyecto se salta al siguiente middlewhere
          res.render('nuevoProyecto', {
            tituloPagina: "Editar",
            proyectos: proyectos,
            proyecto: proyecto
          });

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.actualizarProyecto = function _callee6(req, res) {
  var nombre, proyectos, errores;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          nombre = req.body.nombre;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Proyectos.findAll());

        case 3:
          proyectos = _context6.sent;
          errores = [];

          if (nombre == "") {
            errores.push({
              'texto': "Agrega un nombre a tu proyecto"
            });
          }

          if (!(errores.length > 0)) {
            _context6.next = 10;
            break;
          }

          res.render('nuevoProyecto', {
            tituloPagina: 'Nuevo Proyecto',
            proyectos: proyectos,
            errores: errores
          });
          _context6.next = 13;
          break;

        case 10:
          _context6.next = 12;
          return regeneratorRuntime.awrap(Proyectos.update({
            nombre: nombre
          }, {
            where: {
              url: req.params.url
            }
          }));

        case 12:
          res.redirect('/');

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.eliminarProyecto = function _callee7(req, res, next) {
  var url, resultado;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          //req, query o params
          console.log(req.params);
          url = req.params.url;
          console.log(url);
          _context7.next = 5;
          return regeneratorRuntime.awrap(Proyectos.destroy({
            where: {
              url: url
            }
          }));

        case 5:
          resultado = _context7.sent;

          if (resultado) {
            _context7.next = 9;
            break;
          }

          res.send("Hubo un error");
          return _context7.abrupt("return", next());

        case 9:
          res.status(200).send("Proyecto Eliminado Correctamente");

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  });
}; //Ejemplo ´de crear Ruta


exports.paginaNosotros = function (req, res) {
  res.render('nosotros', {
    tituloPagina: 'Proyectos'
  });
};