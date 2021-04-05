const jwt = require('jsonwebtoken'); //Gestion de Token 04--04-2020 #4
//===================
//Verificar Token
//===================
//......................................................04--04-2020 #4

//middleware
let verificaToken = (req, res, next) => {
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

module.exports = { verificaToken, verifica_Role } //04--04-2020 #4