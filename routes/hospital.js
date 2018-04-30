

//==============================================================
//     Exportacion de librerias
//==============================================================

var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var verificarToken = require('../middlewares/autenticacion');

//Rytas


//==============================================================
//     Obtener todos los hospitales
//==============================================================

app.get('/',(req,res,next)=>{
    var desde =  req.query.desde || 0 ;
    desde = Number(desde);

    Hospital.find({},'_id nombre usuario')
    .populate('usuario', '_id nombre ')
        .skip(desde)
        .limit(5)
        .exec(
            (error,hospitales)=>{
                if(error) {
                    return res.status(500).json({
                        ok:false,
                        mesage:'Error al obtener hospitales',
                        errors:error
                    });
                }

                Hospital.count({},(error,count)=>{
                    res.status(200).json({
                        ok:true,
                        mesage: 'Consulta satisfactoria',
                        hospitales:hospitales,
                        count:count
                    });
                });

                

            }
        );

});


//==============================================================
//     Crear hospital
//==============================================================

app.post('/',verificarToken.verificarToken,(req,res)=>{

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.ima,
        usuario: req.usuario._id
    });

    //Guardar hospital den database

    hospital.save((error,hospitalGuardado)=>{
        if(error){
            return res.status(401).json({
                ok:false,
                mesage:'Error al guardar hospital',
                errors:error
            });

        }
        res.status(200).json({
            ok:true,
            mesage:'hospital guardado',
            hospital:hospitalGuardado
        });


    });
});

//==============================================================
//     Actualizar Hospital
//==============================================================
app.put('/:id',verificarToken.verificarToken,(req,res)=>{
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (error,hospital)=>{
        if(error){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al encontrar registro hospital',
                errors: error
            });
        }

        if(!hospital){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error el hospital con el ide '+id+' no existe',
                error:{error:'no existe'}
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((error, hospitalGuardado)=>{
            if(error){
                return res.status(500).json({
                    ok: false,
                    mesaje: 'Error al actualizar hospital',
                    errors:error
                });
            }
            res.status(201).json({
                ok:true,
                mensaje:'Actualizacion correcta',
                hospital: hospitalGuardado
            });
        });


    });
});

//==============================================================
//     Eliminar Hospital
//==============================================================
app.delete('/:id',verificarToken.verificarToken, (req,res)=>{
    var id = req.params.id;
    Hospital.findByIdAndRemove(id,(error, hospitalEliminado)=>{
        if(error){
            return res.status(500).json({    
                ok:false,
                mensaje: 'Error al eliminar',
                errors: error
            });
        }
        if(hospitalEliminado){
            return res.status(200).json({
                ok: true,
                hospital: hospitalEliminado
            });
        }
    });
});

module.exports = app;