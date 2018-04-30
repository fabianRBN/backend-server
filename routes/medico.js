//==============================================================
//     Exportaciones de librerias
//==============================================================

var express = require('express');
var app = express();
var Medico = require('../models/medico');
var verificarToken = require('../middlewares/autenticacion');

//==============================================================
//     Obtener todos los medicos
//==============================================================

app.get('/',(req,res )=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, '_id nombre usuario hospital')
        .skip(desde)
        .limit(5)
        .populate('usuario', '_id nombre ')
        .populate('hospital','_id nombre')
        .exec(
            (error, medicos)=>{
                if(error){
                    return res.status(500).json({
                        ok: false,
                        mesage: 'Error al obtener medicos',
                        errors:error
                    });
                }
                Medico.count({},(error,count)=>{
                    res.status(200).json({
                        ok:true,
                        mesaje: 'Consulta satisfactoria',
                        medicos: medicos,
                        count:count
                    });
                });
                
            }
        )
});


//==============================================================
//     Crear medico
//==============================================================

app.post('/',verificarToken.verificarToken, (req,res)=>{
    var body = req.body;

    var medico = new Medico({
        nombre : body.nombre,
        hospital : body.hospital,
        usuario : req.usuario._id
    });

    medico.save((error, medicoGuardado)=>{
        if(error){
            return res.status(500).json({
                ok:false,
                mensaje: 'Medico no se pudo guardar',
                errors: error
            });
        }

        res.status(200).json({
            ok:true,
            mensaje: 'Medico guardado',
            medico: medicoGuardado
        });
    });
});

//==============================================================
//     Actualizar medico
//==============================================================

app.put('/:id',verificarToken.verificarToken, (req,res)=>{
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id,(error,medicoEncontrado)=>{
        if(error){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al encontrar el medico',
                errors:error
            });
        }
        if(!medicoEncontrado){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al encontrar el medico con el id '+id,
                errors:error
            });
        }
        medicoEncontrado.nombre = body.nombre;
        medicoEncontrado.usuario = req.usuario._id;
        medicoEncontrado.hospital = body.hospital;


        medicoEncontrado.save((error, medicoGuardado)=>{
            if(error){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico el medico',
                    errors:error
                });
            }

            res.status(200).json({
                ok: true,
                mensaje: 'Medico actualizado',
                medico: medicoGuardado
            });
        });

    })

});


//==============================================================
//     Eliminar medico
//==============================================================

app.delete('/:id',verificarToken.verificarToken,(req,res)=>{
    var id = req.params.id;
    Medico.findByIdAndRemove(id,(error,medicoEliminado)=>{
        if(error){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al eliminar',
                errors:error
            });
        }

        res.status(200).json({
            ok:true,
            mensaje:'Medico eliminado',
            medico:medicoEliminado
        });
    });
});

module.exports = app;
