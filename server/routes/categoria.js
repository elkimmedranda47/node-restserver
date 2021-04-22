const express = require('express');
const { verificaToken, verifica_Role } = require('../middlewares/autenticacion');
const app = express();

//por implementar
const Categorias = require('../models/categoria');
//...........


//========================
//Crear nueva categoria
//========================

app.post('/categoria', verificaToken, (req, res) => {
    //Regresar la nueva categoria
    let usuarioId = req.usuario._id

    let usuario = req.usuario;
    let descripcion = req.body.descripcion;

    Categoria = new Categorias({
        descripcion,
        usuario: usuarioId
    });

    Categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            categoriaDB
        });

    });


});


//========================
//Mostrar todas  categoria
//========================
app.get('/categoria', verificaToken, (req, res) => {

    Categorias.find({})
        .sort({ descripcion: 1 })
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err

                });
            }
            if (categoriaDB) {
                res.json({
                    ok: true,
                    categoriaDB,


                })
            }

        });


});

//========================
//Mostrar categoria por id
//========================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    //let body = req.body;

    Categorias.findById(id, (err, categoriaDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err,
                t: 'ee'
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            catecoria: categoriaDB
        });

    })

});




//========================
//Atualizar categoria
//========================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let descripcion = req.body.descripcion;
    let id = req.params.id;

    let cambiarDescripcion = {
        descripcion: descripcion
    };


    Categorias.findByIdAndUpdate(id, cambiarDescripcion, { runValidators: true }, (err, descripcionDelete) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }

        if (!descripcionDelete) {
            return res.status(400).json({
                ok: false,
                mesage: 'El id no existe'
            });
        }

        res.json({
            ok: true,
            descripcion: descripcionDelete,

        })
    });


});

//========================
//Categoria Eliminar
//========================

app.delete('/categoria/:id', verificaToken, verifica_Role, (req, res) => {
    //solo administrador pueden borrar
    //categorias.findByIdAndRemove

    let id = req.params.id;
    Categorias.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!descripcionDelete) {
            return res.status(400).json({
                ok: false,
                mesage: 'El id no existe'
            });
        }

        res.json({
            ok: true,
            categoriaDB,

        });

    });


});








module.exports = app;