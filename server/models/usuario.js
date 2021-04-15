const mongoose = require('mongoose');



//para validar y personalizar mensajes de error.   Validadion  #1
//npm mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator'); //21-03-2021  Validadion #1
let rolesValidos = {
        values: ['ADMIN_ROLE', 'USER_ROLE'],
        message: '{VALUE} no es un rol válido'
    } //21-03-2021 Validadion #1



let Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        //valor unico reuqerido gracias a una caracteristica de mongoose devulve Mensjae de Error  Validadion#1
        unique: true, //21-03-2021 Validacion #1
        required: [true, 'El Correo es necesario']

    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos //21-03-2021 #1
    },
    estado: {
        type: String,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});
//devolviendo el objeto json Usuario sin la propiedad password  Validadion #1
usuarioSchema.methods.toJSON = function() {
        let user = this;
        let userObject = user.toObject();
        delete userObject.password;
        return userObject;
    } //21-03-2021  #1


//Personalizando Mensjae de Error de validacion de email
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ---> dede ser unico :(' }); //21-03-2021  Validadion #1
mongoose.set('returnOriginal', false); //25-03-2021  Validadion #2

module.exports = mongoose.model('Usuario', usuarioSchema);