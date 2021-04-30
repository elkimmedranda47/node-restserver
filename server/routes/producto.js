const express = require('express');
const { verificaToken, verifica_Role } = require('../middlewares/autenticacion');
const app = express();

//por implementar
const Productos = require('../models/producto');
//...........
const Categorias = require('../models/categoria');


//========================
//Crear  Producto
//========================

app.post('/producto', verificaToken, (req, res) => {

    let usuario = req.usuario._id
    let nombre = req.body.nombre;
    let precioUni = req.body.precioUni;
    let descripcion = req.body.descripcion;
    let disponible = req.body.disponible;
    let categoria = req.body.categoria;
    //let img;



    producto = new Productos({
        usuario,
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        //img
    });


    producto.save((err, productosDB) => {
        if (err) {
            return res.status(500).json({
                ok: fasle,
                err
            })
        }

        res.status(201).json({

            ok: true,
            productos: productosDB

        });
    });


});

//========================
//Atualizar  productos
//========================

app.put('/producto/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;




    Productos.findById(id, (err, productoDB) => {



        if (err) {
            return res.status(500).json({
                ok: fase,
                err
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'EL ID no existe',
                    id
                }
            });
        }



        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({

                ok: true,
                productos: productoGuardado

            })

        });




    });

})

//========================
//Obtener  productos
//========================


app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query || 0;
    desde = Number(desde);

    Productos.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto
            });

        })


})



//========================
//Obtener  producto pr ID
//========================

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Productos.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            if (!productoDB) {

                return res.status(400).json({
                    ok: false,
                    err: { message: 'ID no existe' },
                });
            }


            res.json({
                ok: true,
                productoDB
            });

        })


});


//========================
//Buscar  producto
//=======================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Productos.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, nombreProducto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                prucructo: nombreProducto
            });


        })


});


//========================
//Borrar  producto
//========================

app.delete('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id;

    let cambiarEstado = {
        disponible: false
    };



    Productos.findByIdAndUpdate(id, cambiarEstado, (err, productoBorrado) => {

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Producto No Exites' }
            });
        }

        res.json({
            ok: true,
            usuario: productoBorrado,
            mensaje: 'Producto borrado',
        })


    }); //25-03-2021


})














//fin
module.exports = app;