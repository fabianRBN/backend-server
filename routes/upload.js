// Contenedor de la ruta principal 
//Importaciones

var express =require('express');
var fileUpload = require('express-fileupload');
var app = express();
var fs = require('fs');


//Colecciones

var Usuario = require('../models/usuario');
var Medicos = require('../models/medico');
var Hospital = require('../models/hospital');

//middleware
app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    var tipoValidos = ['hospitales','medicos','usuarios'];

    if(tipoValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok: true,
            mensaje:'Tipo de archivo no valido.',
            errors:{menssage: 'Tipo de archivo no valido.'}    
        });
    }

    if (!req.files){
        return res.status(400).json({
            ok: true,
            mensaje:'No files were uploaded.',
            errors:{menssage: 'debe de seleccionar una imagen'}    
        });
    }

    var archivo = req.files.imagen;

    var nombreImagen = archivo.name;

    var partesnombereImagen = nombreImagen.split('.');

    var extencion = partesnombereImagen[partesnombereImagen.length -1];
   
    var extencionesValidas = [ 'jpg', 'jepg', 'png', 'gif'];

    if(extencionesValidas.indexOf(extencion)<0){
        return res.status(400).json({
            ok: false,
            mensaje:'Extencion no valida',
            errors:{menssage: 'El archivo no posee la extension valida: '+ extencionesValidas.join(', ')}    
        });
    }

    var nombreFile = `${id}-${new Date().getMilliseconds()}.${extencion}`;
    var path = `./upload/${tipo}/${nombreFile}`;

    archivo.mv(path, error=>{
        if(error){
            return res.status(400).json({
                ok: false,
                mensaje:'No se pudo mover el archivo ',
                errors:  error
                
            });
        }
        
    });

    subirPorTipo(tipo, id, nombreFile,res);

  

});

function subirPorTipo(tipo, id ,nombreArchivo,res){
    if(tipo ==='usuarios'){
        Usuario.findById(id,(error, usurioencontrado)=>{

            if(!usurioencontrado){
                return res.status(400).json({
                    ok: false,
                    mensaje:'Usuario no encontrado',
                    erros: error
                });
            }
            var pathViejo = './upload/usuarios/'+usurioencontrado.img;
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            usurioencontrado.img = nombreArchivo;

            usurioencontrado.save((error, usuarioActualizado)=>{
                if(error){
                    return res.status(400).json({
                        ok: false,
                        mensaje:'Imagen usuario no actualizada',
                        erros: error
                    });
                }

                res.status(201).json({
                    ok: true,
                    mensaje:'Archivo actualizado',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    
    if(tipo ==='hospitales'){
        Hospital.findById(id,(error, hospitalEncontrado)=>{

            if(!hospitalEncontrado){
                return res.status(400).json({
                    ok: false,
                    mensaje:'Hospital no encontrado',
                    erros: error
                });
            }

            var pathViejo = './upload/hospitales/'+hospitalEncontrado.img;
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            hospitalEncontrado.img = nombreArchivo;

            hospitalEncontrado.save((error, hospitalesActualizado)=>{
                if(error){
                    return res.status(400).json({
                        ok: false,
                        mensaje:'Imagen hospital no actualizada',
                        erros: error
                    });
                }

                res.status(201).json({
                    ok: true,
                    mensaje:'Archivo actualizado',
                    hospital: hospitalesActualizado
                });
            });
        });
        
    }

    if(tipo ==='medicos'){
        Medicos.findById(id,(error, MedicoEcontrado)=>{
            if(!MedicoEcontrado){
                return res.status(400).json({
                    ok: false,
                    mensaje:'Medico no encontrado',
                    erros: error
                });
            }
            var pathViejo = './upload/medicos/'+MedicoEcontrado.img;
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            MedicoEcontrado.img = nombreArchivo;

            MedicoEcontrado.save((error, medicoActualizado)=>{
                if(error){
                    return res.status(400).json({
                        ok: false,
                        mensaje:'Imagen medico no actualizada',
                        erros: error
                    });
                }

                res.status(201).json({
                    ok: true,
                    mensaje:'Archivo actualizado',
                    medico: medicoActualizado
                });
            });
        });
        
    }
}


module.exports = app;