//SERVICIO DE USUARIOS

const express = require('express');
// npm  bcrypt, Encriptar contraseñas   
const bcrypt = require('bcrypt'); //21-03-2021 Validadion #1

//npm underscore,  validar que parametros del esquema/modelo puede ser modificado #2
const _ = require('underscore'); //25-03-2021

const Usuarios = require('../models/usuario');
//const usuario = require('../models/usuario');
const app = express();



app.get('/usuario', function(req, res) {
    // La Propiedad query cactura las variables del url
    let desde = req.query.desde || 0; //26-03-2020 #3
    desde = Number(desde);
    let limite = req.query.limite || 5; //26-03-2020 #3
    limite = Number(limite);

    //Usuarios.find({ google: true }) devuelve todos los usuarios con estado  google: true
    Usuarios.find({ estado: true }, 'estado email google img nombre role') //26-03-2020 #3
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err

                });
            }
            //Usuarios.count({ google: true }, (err, conteo) => {
            Usuarios.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo

                })
            })

        }) //26-03-2020 #3
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuarios({
        nombre: body.nombre,
        email: body.email,
        //Encriptando pass una sola via
        password: bcrypt.hashSync(body.password, 10), //21-03-2021 Validadion #1
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    //let body = req.body;
    //Documentacion, https://underscorejs.org/#pick
    //Negar la Modificacion de los campos  password y google, solo dejar moificar ('nombre', 'email', 'img', 'rol', 'estado')
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']); //25-03-2021 Validation #2

    Usuarios.findByIdAndUpdate(id, body, { runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })


    }); //25-03-2021




});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    //let body = _.pick(req.body, ['nombre']);//trabajar en la devolouvion del docuemnto  esta linea no salio
    let body = req.body;

    let cambiarEstado = {
        estado: false
    };

    //Usuarios.findByIdAndRemove(id,(err,usuarioBorrado)=>{});// Borrar documento  de la DB de mongo

    Usuarios.findByIdAndUpdate(id, cambiarEstado, (err, usuarioBorrado) => {

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no encontrado' }
            });
        }

        res.json({
            ok: true,
            id: id,
            usuario: usuarioBorrado
        })


    }); //25-03-2021


});



//Exportando el archivo o modulo app con los middleware ya configurados,  "En pocas palabras estamos gestionando las rutas y Cargandolas al modulo app de express para usarla en el main de la aplicacion que seria server.js.
//cargamdo middleware ya configurado para usarlos en otros archivos
module.exports = app;