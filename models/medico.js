var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre:{type:String, required:[true,'Nombre requerido']},
    img:{type:String ,required:false},
    usuario:{type:Schema.Types.ObjectId,ref:'Usuario', required:true},
    hospital:{type:Schema.Types.ObjectId,
        ref:'Hospital', 
        required:[true,'EL ID DE HOSPITAL CAMPO OBLIGATORIO']}
});

module.exports = mongoose.model('Medico',medicoSchema);