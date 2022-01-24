const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText  = require('html-to-text')
const  util  = require('util')
const emailConfig = require('../config/email.js')
const res = require('express/lib/response')

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.host,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    }
});

transport.verify((err, success) => {
    if (err) console.error("Error en la configuracion del email: " +err);
    else 
    console.log('Configuracion del correo correcta');
});


const generarHTML = (archivo, opciones = {}) =>{
    const html = pug.renderFile(`${__dirname}/../views/email/${archivo}.pug`, opciones);
    return juice(html);
}

exports.enviar =  async(opciones) =>{
    //console.log(opciones)
    
    const html =  generarHTML(opciones.archivo, opciones);
    const text = htmlToText.fromString(html)
    let mailOptions = {
        from: 'UpTask <no-reply@uptask.com',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text: text,
        html: html
      };
    
    const  enviarEmail = util.promisify(transport.sendMail, transport) //con promisify conviertes algo que soporta promises a algo que soporta async await
    return enviarEmail.call(transport, mailOptions, function (err, info) { 
        if (err) {
          console.log ("Error al enviar el correo" +err) 
          //¬opciones.url
        }
        else 
          console.log ('Email sent:' + info.response);       
     },
        
     );

     
    
    
}

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

