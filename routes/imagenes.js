// Contenedor de la ruta principal 
//Importaciones

var express =require('express');
var app = express();


var fs = require('fs');


// Rutas
app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = `./upload/${tipo}/${img}`;

    fs.exists(path, existe=>{
        if(!existe){
            path = './assets/img-no.jpeg';       
        }

        res.sendfile(path);
    });
    
});

module.exports = app;