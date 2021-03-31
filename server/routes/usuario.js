const express = require('express');

const bcrypt = require('bcrypt'); //21-03-2021 Validadion #1
//validar que parametros del esquema/modelo puede ser modificado #2
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

    //Usuarios.find({ google: true })

    Usuarios.find({ estado: true }, ' email google img nombre role') //26-03-2020 #3
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
                    cuantos: conteo,
                    puerto: process.env.PORT
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
        role: body.role,

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
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']); //25-03-2021 Validadion #2





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
    //let body = _.pick(req.body, ['nombre']);


    let cambiarEstado = {
        estado: false
    };
    const query = { id, estado: true };

    Usuarios.findByIdAndUpdate(query, cambiarEstado, (err, usuarioBorrado) => {


        /*  if (err) {
              return res.status(400).json({
                  ok: false,
                  err

              });
          }*/
        if (!usuarioBorrado) {
            return res.status(400).json({

                ok: false,
                err: { message: 'Usuario no encontrado' }
            });

        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })


    }); //25-03-2021

    // res.json(id)
});




module.exports = app;