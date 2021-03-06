//npm install jsonwebtoken --save
const jwt = require('jsonwebtoken'); //Gestion de Token 04--04-2020 #4
//===================
//Verificar Token
//===================
//......................................................04--04-2020 #4

//middleware
let verificaToken = (req, res, next) => {

    //Octener la variable token que viene del  headers y entregar ó encapsular el objeto usuario en  req.usuraio para que cualquier servicio atraves del middleware pueda ostener sus datos 
    let token = req.get('token');


    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decode.usuario;

        next();
    });


};

//===================
//Verificar Token para imagen
//===================

let verificaTokenImg = (req, res, next) => {

    //Octener la variable token que viene del  headers y entregar ó encapsular el objeto usuario en  req.usuraio para que cualquier servicio atraves del middleware pueda ostener sus datos 
    let token = req.query.token;


    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido img'
                }
            });
        }
        req.usuario = decode.usuario;

        next();

    });


};


//middleware
let verifica_Role = (req, res, next) => {

        let usuario = req.usuario;


        if (usuario.role === 'USER_ROLE') {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Role no valido'
                }
            });
        }
        if (usuario.role === 'ADMIN_ROLE') {
            next();
        }

    }
    //................................................04--04-2020 #4

module.exports = { verificaToken, verifica_Role, verificaTokenImg } //04--04-2020 #4