'use strict'

// Conexion a la DB
var mongoose = require('mongoose');
var app = require('./app');
var port = 	process.env.PORT || 3977; //Creo un puerto

mongoose.connect('mongodb://localhost/db_curso_mean', (err, res) => {
	if (err) {
		throw err;
	} else{
		console.log('Conectado a la DB');
		// Pongo el servidor a escuchar el puerto
		app.listen(port, function() {
			console.log('Escuchando en: ' + port);
		});
	}
});