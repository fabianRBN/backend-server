//Importaciones

var express =require('express');
var bcrypt = require('bcryptjs');


var app = express();

var Usuario = require('../models/usuario');
var verificarToken = require('../middlewares/autenticacion');

// Rutas


//========================================
//Obtener todos los usuaros
//========================================
app.get('/', (req, res, next) => {

    Usuario.find({},'_id nombre email pasword img role')
        .exec(
            (err,usuarios)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error al cargar usuarios',
                    errors: err
                });
            }

        res.status(200).json({
            ok:true,
            usuario: usuarios
        });
    });

    
});

//=======================================================
//Crear un nuevo usuario
//=======================================================

app.post('/',verificarToken.verificarToken,(req, res)=>{
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        pasword: bcrypt.hashSync(body.pasword, bcrypt.genSaltSync(10)),
        role: body.role
    });
    // Guardar usuario en mongo
    usuario.save((error, usruariGuaradado)=>{
        if(error){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al crear usuario',
                errors: error
            });
        }
        res.status(201).json({
            ok:true,
            body: usruariGuaradado,
            usuarioToken: req.usuario
        });
    });
});

//==============================================================
//     Actulizar usuario
//==============================================================

app.put('/:id',(req,res)=>{
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (error, usuario)=>{
        if(error){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error el usuario con el id:'+id+' no exist ',
                error: {error:'No esiste usuario'}
            });
        }
        

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((error, usuariGuardado)=>{
            if(error){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar al usuario',
                    errors: error
                });
            }

            res.status(201).json({
                ok:true,
                mensaje:'Usuario actualizado',
                usuario: usuariGuardado 
            });
        
        });
    });



});

//==============================================================
//     Eliminar usuario
//==============================================================

app.delete('/:id',(req,res)=>{
    var id = req.params.id;
    Usuario.findByIdAndRemove(id,( error ,usuarioBorrado)=>{
        if(error){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: error
            });
        }

        if(usuarioBorrado){
            return res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });
        }
    });
});

module.exports = app;