const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor () {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Conectar a base de datos
        this.conectarBD();

        //Middlewares
        this.middlewares();

        //Mis rutas
        this.routes();
    }

    async conectarBD(){
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        //Lectura y parsei del body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );
        
    }

    routes() {

        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running in http://localhost:${this.port}`);
        })
    }



}

module.exports = Server;