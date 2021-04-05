const express = require('express');
const bcrypt = require('bcrypt');
// npm  jsonwebtoken, crear verificar etc.. token
var jwt = require('jsonwebtoken'); // Gestion de Token ..............04--04-2020 #4
const Usuarios = require('../models/usuario');
const app = express();

//....................................................................04--04-2020 #4
app.post('/login', (req, res) => {

    let body = req.body;

    Usuarios.findOne({ email: body.email }, (err, usuarioDB) => {

        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: '(Usuario) o Contraseña no encontrado'

                }

            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (Contraseña) no encontrado',

                }
            });

        }
        //https://www.npmjs.com/package/jsonwebtoken#token-expiration-exp-claim
        //Token Expiration (exp claim)
        //Signing a token with 1 hour of expiration:
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token


        });

    });



})

//....................................................................04--04-2020 #4















//fin
module.exports = app;