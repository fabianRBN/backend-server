// Requires 
var express = require('express');
var mongoose = require('mongoose');

//inicializar variables
var app = express();

// coneccion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb',(err, resp)=>{
    if(err) throw err;

    console.log('Base de datos :\x1b[32m%s\x1b[0m',' online');

} );

// Rutas
app.get('/', (req, res, next) => {
    res.status(403).json({
        ok:true,
        mensaje: 'peticion reaizada correctamente'
    });
});

//Escuchar peticiones
app.listen(3000, ()=> {
    console.log('express server puerto 3000:\x1b[32m%s\x1b[0m',' online');
});
