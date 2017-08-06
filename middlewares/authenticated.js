'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'claveSecreta';

// Validar si son correctos los datos del token que llegan
exports.ensureAuth = function(req, res, next){
	if (!req.headers.authorization) {
		return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
	}

	var token = req.headers.authorization.replace(/['"]+g/, '');

	// Decodificar el token
	try {
		var payload = jwt.decode(token, secret);

		if (payload.exp <= moment().unix()) {
			return res.status(401).send({message: 'El token ha expirado'});	
		}
	} catch(ex) {
		console.log(ex);
		return res.status(404).send({message: 'Token no válido'});
	}

	req.user = payload;

	next();
};