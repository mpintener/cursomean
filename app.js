// Lógica de Express

'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar rutas
var user_routes = require('./routes/user.routes');
var artist_routes = require('./routes/artist.routes');
var album_routes = require('./routes/album.routes');
var song_routes = require('./routes/song.routes');

// Configurar body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // Convierte peticion a JSON

// Configurar cabeceras http
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Acces-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Access', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});
// rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

// exportar el modulo
module.exports = app;