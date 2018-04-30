var express =require('express');

var app = express();

//==============================================================
//     Modelos
//==============================================================

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');




// Rutas

//==============================================================
//     Busqueda general
//==============================================================
app.get('/todo/:filtro', (req, res, next) => {
    var filtro = req.params.filtro;
    var regex = new RegExp(filtro,'i');

    Promise.all([
        buscarHospita(regex,filtro),
        buscarMedicos(regex,filtro),
        buscarusuarios(regex,filtro)
    ]).then(respuesta =>{
        res.status(200).json({
            ok:true,
            mensaje: 'peticion reaizada correctamente',
            medicos: respuesta[1],
            hospitales:respuesta[0],
            usuarios:respuesta[2]
        });
    });
    
});

//==============================================================
//     Busqueda Especifica
//==============================================================

app.get('/:tipo/:filtro',(req,res)=>{

    
    var tipo = req.params.tipo;
    var filtro = req.params.filtro;

    var regex = new RegExp(filtro,'i');

    var promesaBusqueda = null;
    switch (tipo){
        case 'medico':
            promesaBusqueda =  buscarMedicos(regex,filtro);
            break;
        case 'hospital':
            promesaBusqueda =  buscarHospita(regex,filtro);
            break;
        case 'usuario':
            promesaBusqueda =  buscarusuarios(regex,filtro);
            break;
        default:
            return  res.status(200).json({
                ok:true,
                mensaje: 'consuta fallida',
                
        });
            break;
    }

    promesaBusqueda.then((resultado)=>{
        
        res.status(200).json({
            ok:true,
            mensaje: 'consuta exitosa',
            [tipo]: resultado
        });
    });

});

function buscarHospita(regex, filtro){
    return new Promise((resolve, reject)=>{
        

        Hospital.find({nombre: regex },(error,hospitales)=>{
            if(error){
                reject('Error al  consultar Hospitales', error);
            }else{
                resolve(hospitales);
            }

        });
    });

}

function buscarMedicos(regex, filtro){
    return new Promise((resolve, reject)=>{
        
        Medico.find({nombre: regex },(error,medicos)=>{
            if(error){
                reject('Error al  consultar Hospitales', error);
            }else{
                resolve(medicos);
            }

        });
    });

}

function buscarusuarios(regex, filtro){
    return new Promise((resolve, reject)=>{
        
        Usuario.find({}, 'nombre role email')
            .or([{nombre: regex}, {email:regex}])
            .exec((error,usuarios)=>{
                if(error)
                {
                    reject( 'Error al consultar usuarios');
                }else{
                    resolve(usuarios);
                }
            });
    });

}

module.exports = app;