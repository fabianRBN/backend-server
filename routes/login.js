//Importaciones

var express =require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();

var Usuario = require('../models/usuario');
var CODE = require('../config/config').CODE;


app.post('/',(req, res)=>{

    var body = req.body;

    // Buscar registro por post
    Usuario.findOne({email: body.email},(error, usurariDB)=>{

        // manejo de eerores
        if(error){
            return res.status(500).json({
                ok:true,
                error:'Error al logearse'
            });
        }
        // Comprobar existencia de usuario
        if(!usurariDB){
            return res.status(400).json({
                ok: false,
                error:'Usuario no existe'
            });
        }
        // Comparacion de password 
        if( !bcrypt.compareSync(body.pasword, usurariDB.pasword)){
            return res.status(400).json({
                ok: false,
                error:'Contraseña incorrecta'
            });
        }

        //Token

        usurariDB.pasword = ':D';
        var token = jwt.sign({usuario: usurariDB}, CODE, {expiresIn:14400});


        // Respuesta  correcta
        res.status(400).json({
            ok:true,
            mensaje:'Login post correcto',
            usuario: usurariDB,
            token: token
        });
      

    });


});










module.exports = app;
