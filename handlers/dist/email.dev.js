"use strict";

var nodemailer = require('nodemailer');

var pug = require('pug');

var juice = require('juice');

var htmlToText = require('html-to-text');

var util = require('util');

var emailConfig = require('../config/email.js');

var res = require('express/lib/response');

var transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.host,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});
transport.verify(function (err, success) {
  if (err) console.error("Error en la configuracion del email: " + err);else console.log('Configuracion del correo correcta');
});

var generarHTML = function generarHTML(archivo) {
  var opciones = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var html = pug.renderFile("".concat(__dirname, "/../views/email/").concat(archivo, ".pug"), opciones);
  return juice(html);
};

exports.enviar = function _callee(opciones) {
  var html, text, mailOptions, enviarEmail;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //console.log(opciones)
          html = generarHTML(opciones.archivo, opciones);
          text = htmlToText.fromString(html);
          mailOptions = {
            from: 'UpTask <no-reply@uptask.com',
            to: opciones.usuario.email,
            subject: opciones.subject,
            text: text,
            html: html
          };
          enviarEmail = util.promisify(transport.sendMail, transport); //con promisify conviertes algo que soporta promises a algo que soporta async await

          return _context.abrupt("return", enviarEmail.call(transport, mailOptions, function (err, info) {
            if (err) {
              console.log("Error al enviar el correo" + err); //¬opciones.url
            } else console.log('Email sent:' + info.response);
          }));

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};
/*exports.enviar =  () =>{
    //console.log(opciones)
    let mailOptions = {
        from: 'UpTask <no-reply@uptask.com',
        to: "receiver@sender.com",
        subject: "Prueba",
        text: "Prueba",
        html: generarHTML()
      };
    
    //const  enviarEmail = util.promisify(transport.sendMail, transport) //con promisify conviertes algo que soporta promises a algo que soporta async await
    //return enviarEmail.call(transport, mailOptions)
    return (transport.sendMail(mailOptions, function (err, info) { 
        if (err) 
          console.log ("Error al enviar el correo" +err) 
        else 
          console.log ('Email sent:' + info.response);       
     }));
}
 */