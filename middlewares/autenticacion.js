//Importaciones

var express =require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var CODE = require('../config/config').CODE;

//==============================================================
//     Verificacion token
//==============================================================

exports.verificarToken = function(req,res,next){

    var toke = req.query.token;
    jwt.verify(toke,CODE, (error, decode)=>{
        if(error){
            return res.status(401).json({
                ok: false,
                mesage:'El token es incorrecto',
                errors:error
            });
        }
        req.usuario = decode.usuario;
        next();

        // res.status(200).json({
        //     ok:true,
        //     mesage: 'token correcto'
        // })
    });

}

