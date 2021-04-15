const express = require('express');
const bcrypt = require('bcrypt');

// npm  jsonwebtoken, crear verificar etc.. token
var jwt = require('jsonwebtoken'); // Gestion de Token ..............04--04-2021 #4

//npm install google-auth-library --save.........................................modulo-11......15-04-2021 #5................
//https://developers.google.com/identity/sign-in/web/backend-auth
/*Using one of the Google API Client Libraries (e.g. Java, Node.js, PHP, Python) is the recommended way to validate Google ID tokens in a production environment.*/
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
//npm install google-auth-library --save..........................................modulo-11......15-04-2021 #5..............^

const Usuarios = require('../models/usuario');
const app = express();

//....................................................................04--04-2021 #4
app.post('/login', (req, res) => {

    let body = req.body;

    Usuarios.findOne({ email: body.email }, (err, usuarioDB) => {
        // el err no funciono no se por qeu
        /*   if (err) {
               return res.status(500).json({
                   ok: false,
                   err
               });
             }
        */
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o Contraseña no encontrado'

                }

            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o Contraseña no encontrado',

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

//....................................................................04--04-2021 #4

//.......................................................................................modulo-11.....15-04-2021 #5..
//Configuraciones de google........Integrating Google Sign-In into your web app...................

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    /*console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);*/
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true

    }

}

// Sericio que permite registrar usuarios con ceunta de google
app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        });



    Usuarios.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        // este err; En app.post('/login', (req, res) => {} No funciono
        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }

        //si existe un usuario de base de datos, de locontrario registralo en BD
        if (usuarioDB) {

            // si no esta autenticado por google, de lo contrario atualiza el token
            //Saber si esta autenticado por google o no
            if (usuarioDB.google == false) {

                return res.status(400).json({
                    ok: false,
                    err: { message: 'Debe usar su autenticacion normal, el usuario ya Existe' }
                });

            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({

                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            }

        } else {
            let usuario = new Usuarios();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });

            });
        }

    });

    /*  res.json({
          usuario: googleUser
      });
      */
});


//..................................................................................modulo-11......15-04-2021 #5..,..^











//fin
module.exports = app;