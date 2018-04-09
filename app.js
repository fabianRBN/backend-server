// Requires 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
//inicializar variables
var app = express();


//==============================================================
//     Configuracion de body parser
//==============================================================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())




//==============================================================
//     importar rutas
//============================================================== 
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login')


// coneccion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb',(err, resp)=>{
    if(err) throw err;

    console.log('Base de datos :\x1b[32m%s\x1b[0m',' online');

} );

// Rutas
// app.get('/', (req, res, next) => {
//     res.status(200).json({
//         ok:true,
//         mensaje: 'peticion reaizada correctamente'
//     });
// });

// Middleward
app.use('/usuario',usuarioRoutes);
app.use('/login',loginRoutes);
app.use('/',appRoutes);


//Escuchar peticiones
app.listen(3000, ()=> {
    console.log('express server puerto 3000:\x1b[32m%s\x1b[0m',' online');
});
