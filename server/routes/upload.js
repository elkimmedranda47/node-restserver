const express = require('express');
//npm install express-fileupload
//ejemplo muy parecido https://github.com/richardgirges/express-fileupload/tree/master/example
const fileUpload = require('express-fileupload');
const app = express();

const Usuarios = require('../models/usuario');
const Productos = require('../models/producto');

// paquetes ya vienen con node
const fs = require('fs');
const path = require('path');



// default options
app.use(fileUpload());

//SERVICIO DE CARGUE DE ARCHIVO
app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;





    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    //Validar tipo
    let tiposValidos = ['producto', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Tipos permitidos son: ' + tiposValidos.join(', ')
                }
            });

    }
    //let archivo = req.files.archivo; n = n1.n2.archivo, archivo es el nombre de la variable que llega des de frontend, si en el frontend se llama archivo en el  backend tambien, esta bariable llega dentro del req.files.
    let archivo = req.files.archivo;
    let archvicoCortado = archivo.name.split('.');
    //cacturar la extencion del archivo en un string
    let extension = archvicoCortado[archvicoCortado.length - 1];


    //Extensiones permitidas
    let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: 'Las extensioines permitidas son:  ' + extensionesPermitidas },
            extension: extension
        });

    }
    //Cambiar nombre del archivo; nombreArchivo = id+timepo+.+extencion;
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    // 1) guardar el archivo en el servidor
    archivo.mv(`upload/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //cacturar el nombre del archivo que ya esta guardado en el servidor, para guardar solo el nombre en la BD del usuario
        //los archvios fisicos se guardan en el servidor, en mongo se guardan los nombres, con el nombre se hace una busqueda en el servidor para encontrarlos y mostrartlos 

        // 2) guardar el nombre del archivo en el DB del uaurio n   


        if (tipo === 'usuario') {

            imagenUsuario(id, res, nombreArchivo);

        }


        if (tipo === 'producto') {
            imagenProducto(id, res, nombreArchivo);
        }

    });



});



//-----------------
//Guardar imagen al usuario
//-----------------
//Esta fucnio Borra la el nombre de imagen tenga o no tenga y despues guarda elnombre en la DB
function imagenUsuario(id, res, nombreArchivo) {

    Usuarios.findById(id, (err, usuarioDB) => {

        if (err) {
            //si hay un error con la conexion a la DB, borre el archivo del servidor
            borraArchvo(nombreArchivo, 'usuario');

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            //si el usuario no exite, borre el archivo del servido
            borraArchvo(nombreArchivo, 'usuario');

            return res.status(400).json({
                ok: false,
                err
            });
        }
        //Esta linea borra  el nombre de la imagen del usuario que viene de BD
        borraArchvo(usuarioDB.img, 'usuario');
        //Esta linia Atualiza  el nombre de la imagen del usuario que viene de BD con el nombre nuevo de la imagen cargada
        usuarioDB.img = nombreArchivo;
        // Esta linea giarda el usuario DB con el nuevo nombre de la imagen
        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo,
            });
        })

    });
}

//-----------------
//Guardar imagen al producto
//
//Esta fucnio Borra la el nombre de imagen tenga o no tenga el Producto  y despues guarda el nombre en la DB, tal cual como arriva

function imagenProducto(id, res, nombreArchivo) {


    Productos.findById(id, (err, productoDB) => {

        if (err) {
            //si hay un error con la conexion a la DB, borre el archivo del servidor
            borraArchvo(nombreArchivo, 'producto');

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            //si el usuario no exite, borre el archivo del servido
            borraArchvo(nombreArchivo, 'producto');

            return res.status(400).json({
                ok: false,
                err
            });
        }

        borraArchvo(productoDB.img, 'producto');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo,
            });
        })

    });
}




function borraArchvo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../upload/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;