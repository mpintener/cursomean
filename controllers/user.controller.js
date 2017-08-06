'use strict'
// Middleware: metodo que se ejecuta en el controlador antes de que se ejecute la acción. En un peticion http lo primero que se ejecuta es el middleware.

var fs = require('fs');
var path = require('path');
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

function login(req, res){
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

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error al actualizar el usuario'});
		} else {
			if (!userUpdated) {
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			} else {
				res.status(200).send({user: userUpdated});
			}
		}
	});
}

function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		console.log(file_split);

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
				if (!userUpdated) {
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				} else {
					res.status(200).send({user: userUpdated});
				}
			});
		} else {
			res.status(500).send({message: 'Formato de archivo no válido.'});	
		}
	} else {
		res.status(200).send({message: 'No has subido ninguna imagen...'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var imagePath = './uploads/users/' + imageFile;

	fs.exists(imagePath, function(exists){
		if (exists) {
			res.sendFile(path.resolve(imagePath));
		} else {
			res.status(200).send({
				message: 'La imagen no existe'
			});
		}
	})

}

module.exports = {
	getImageFile,
	uploadImage,
	updateUser,
	pruebas,
	saveUser,
	login
};