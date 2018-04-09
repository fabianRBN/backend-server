// Contenedor de la ruta principal 
//Importaciones

var express =require('express');
var app = express();


// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok:true,
        mensaje: 'peticion reaizada correctamente'
    });
});

module.exports = app;