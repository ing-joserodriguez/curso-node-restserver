const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    
    const [ total, usuarios] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip( Number(desde) )
            .limit( Number(limite) )
    ]);

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req = request, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    //Encriptar la contrasena
    const salt = await bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //Validar contra BD
    if ( password ) {
        //Encriptar la contrasena
        const salt = await bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg:'put API - Controlador',
        usuario
    })
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg:'patch API - Controlador'
    })
}

const usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;

    //Borrar registro fisicamente
    //const usuario = await Usuario.findByIdAndDelete( id );

    //Borrar registro logico
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    res.json( usuario );
}

module.exports = { 
    usuariosGet, usuariosPost,
    usuariosPut, usuariosPatch,
    usuariosDelete
}