require('./config/config');
// npm express, importando gestion de servidor NN-NN-2021 #N
const express = require('express');
const app = express();
//npm mongoose, importando gestion de DB-mongo NN-NN-2021 #N
const mongoose = require('mongoose');

//los app.use() son middleware que se ejecutan cada vez que haya una peticion o mas claro cada peticion que se aga va a pasar por esas lineas

//
//npm body-parser, NN-NN-2021 #N.  Procesar peticiones x-www-form-urlencoded,nos permite cacturar el "body" de la peticion (req.body). NN-NN-2021 #N
//........................................................ NN-NN-2021 #N
const bodyParser = require('body-parser');

//***** titulo de la docuemntacion: Examples ***
//https://www.npmjs.com/package/body-parser
/*
Examples
Express/Connect top-level generic
*/
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
//........................................................ NN-NN-2021 #N

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

//Gestionando las rutas.
app.use(require('./routes/index'));

//Configurar por que puerto va a escuchar  el servidor /config/config
app.listen(process.env.PORT, () => {
    console.log(`Escuchando por el purto ${process.env.PORT}`);
})