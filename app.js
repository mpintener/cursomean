// Lógica de Express

'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar rutas
var user_routes = require('./routes/user.routes');
var artist_routes = require('./routes/artist.routes');
var album_routes = require('./routes/album.routes');

// Configurar body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // Convierte peticion a JSON

// Configurar cabeceras http

// rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);

// exportar el modulo
module.exports = app;