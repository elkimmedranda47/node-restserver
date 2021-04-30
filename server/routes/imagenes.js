const express = require('express');
const fs = require('fs');

const path = require('path');
const { verificaToken, verificaTokenImg } = require('../middlewares/autenticacion');
let app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImagen = path.resolve(__dirname, `../../upload/${tipo}/${img}`);




    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagenPath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagenPath);
    }

    //res.sendfile('./server/assets/no-image.jpg');


});







module.exports = app;