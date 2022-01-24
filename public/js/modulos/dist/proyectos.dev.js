"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
  btnEliminar.addEventListener('click', function (e) {
    var urlProyecto = e.target.dataset.proyectoUrl; //console.log(urlProyecto)

    _sweetalert["default"].fire({
      title: 'Seguro quieres eliminar el proyecto?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3'
      }
    }).then(function (result) {
      if (result.isConfirmed) {
        var url = "".concat(location.origin, "/proyectos/").concat(urlProyecto);
        console.log(url);

        _axios["default"]["delete"](url, {
          params: {
            urlProyecto: urlProyecto
          }
        }).then(function (respuesta) {
          console.log(respuesta);

          _sweetalert["default"].fire('Proyecto Eliminado!', respuesta.data, 'success').then(function (result) {
            if (result.isConfirmed) {
              window.location.href = '/';
            }
          });
        })["catch"](function () {
          _sweetalert["default"].fire({
            type: 'error',
            title: 'Hubo un error',
            text: 'No fue posible eliminar el proyecto'
          });
        });
      } else if (result.isDenied) {
        _sweetalert["default"].fire('Changes are not saved', '', 'info');
      }
    });
  });
}

var _default = btnEliminar;
exports["default"] = _default;