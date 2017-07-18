'use strict'
// Middleware: metodo que se ejecuta en el controlador antes de que se ejecute la acción. En un peticion http lo primero que se ejecuta es el middleware.

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
	res.status(200).send({
		message: 'Probando probando action Pruebas'
	});
}

function saveUser(req, res){
	var user = new User();

	var params = req.body;

	console.log(params);
	user.first_name = params.first_name;
	user.last_name = params.last_name;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	// guardo los datos en la DB
	if (params.password) {
		// Encriptar contraseña
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if (user.first_name != null && user.last_name != null && user.email != null) {
				// Guardar usuario
				user.save((err, userStored) => {
					if (err) {
						res.status(500).send({message: 'Error al guardar el usuario'});
					} else {
						if (!userStored) {
							res.status(404).send({message: 'No se ha registrado el usuario'});
						} else {
							res.status(200).send({ user: userStored });
						}
					}
				});
			} else {
				res.status(200).send({ message: 'Hay campos sin completar' });
			}
		});
	} else {
		// Devolver error 200
		res.status(200).send({
			message: 'Introduce la contraseña'
		});
	}
}

function login(req, res) {
	var params = req.body;

	var email = params.email;
	var password = params.password;
	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!user) {
				res.status(404).send({message: 'El usuario no existe'});
			} else {
				// Comprobar contraseña
				bcrypt.compare(password, user.password, (err, check) => {
					if (check) {
						// Devolver datos usuario
						if (params.gethash) {
							// devolver token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						} else {
							res.status(200).send({user});
						}
					} else {
						res.status(404).send({message: 'El usuario no ha podido loguearse'});
					}
				});
			}
		}
	});

}

module.exports = {
	pruebas,
	saveUser,
	login
};