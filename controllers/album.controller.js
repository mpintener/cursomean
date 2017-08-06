'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
	console.log(req);
	var albumId = req.params.id;

	Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!album) {
				res.status(404).send({message: 'Error al obtener el album'});
			} else {
				res.status(200).send({album});
			}
		}
	});
}

function getAlbums(req, res) {
	var artistId = req.params.artist;

	if (!artistId) {
		// Mostrar todos los álbumes
		var find = Album.find({}).sort('title');
	} else {
		// Mostrar los albumes de un artista
		var find = Album.find({artist: artistId}).sort('year');
	}

	find.populate({path: 'artist'}).exec((err, albums) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!albums) {
				res.status(404).send({message: 'No se encontraron albumes'});
			} else {
				res.status(200).send({albums});
			}
		}
	});
}

function saveAlbum(req, res){
	var params = req.body;
	var album = new Album();

	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!albumStored) {
				res.status(404).send({message: 'Error al guardar el álbum'});
			} else {
				res.status(200).send({album: albumStored});
			}
		}
	})
}

function updateAlbum(req, res) {
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!albumUpdated) {
				res.status(404).send({message: 'Error al actualizar el álbum'});
			} else {
				res.status(200).send({album: albumUpdated});
			}
		}
	});
}

function deleteAlbum(req, res) {
	var albumId = req.params.id;

	Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!albumRemoved) {
				res.status(404).send({message: 'Error al eliminar el álbum'});
			} else {
				Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
					if (err) {
						res.status(500).send({message: 'Error en la petición' });
					} else {
						if (!songRemoved) {
							res.status(404).send({message: 'Error al eliminar la canción'});
						} else {
							res.status(200).send({album: albumRemoved});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res){
	var albumId = req.params.id;
	var file_name = 'No subido...';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		console.log(file_split);

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
			Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
				if (!albumUpdated) {
					res.status(404).send({message: 'No se ha podido actualizar el album'});
				} else {
					res.status(200).send({user: albumUpdated});
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
	var imagePath = './uploads/albums/' + imageFile;

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
	getAlbum,
	getAlbums,
	saveAlbum,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}