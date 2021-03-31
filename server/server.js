require('./config/config');
// npm express, importando middleware
const express = require('express');
const app = express();
//npm mongoose, importando gestion de DB-mongo
const mongoose = require('mongoose');

//los app.use() son middleware que se ejecutan cada vez que haya una peticion o mas claro cada peticion que se aga va a pasar por esas lineas


//npm body-parser,  procesar peticiones x-www-form-urlencoded,nos permite cacturar el "body" de la peticion (req.body).
const bodyParser = require('body-parser');

//***** titulo de la docuemntacion: Examples ***
//https://www.npmjs.com/package/body-parser
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//**********************************************

//conectando ala base de datos 

mongoose.connect(process.env.URL_DB_EKN47, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos ONLINE');
    });

//Gestionando el middleware usuario.
app.use(require('./routes/usuario'));

//Configurar por que puerto va a escuchar la el servidor /config/config
app.listen(process.env.PORT, () => {
    console.log(`Escuchando por el purto ${process.env.PORT}`);
})