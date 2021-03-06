'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist) => {
		if (err) {
			res.status(500).send({
				message: 'Error al obtener el artista'
			});
		} else { 
			if (!artist) {
				res.status(404).send({
					message: 'El artista no existe'
				});
			} else {
				res.status(200).send({artist});
			}
		}
	});
}

function getArtists(req, res){
	var page;
	var itemsPerPage = 10;

	req.params.page ? page = req.params.page : page = 1;

	Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
		if (err) {
			res.status(500).send({
				message: 'Error en la peticion'
			});
		} else {
			if (!artists) {
				res.status(404).send({
					message: 'No se encontraron artistas'
				});
			} else {
				return res.status(200).send({
					total_items: total,
					artists: artists
				});
			}
		}
	})
}

function saveArtist(req, res){
	var artist = new Artist();
	var params = req.body;

	artist.image = 'null';
	artist.name = params.name;
	artist.description = params.description;
	artist.save((err, artistStored) => {
		if (err) {
			res.status(404).send({
				message: 'Error al guardar el Artista'
			});
		} else {
			if (!artistStored) {
				res.status(404).send({
					message: 'Error al guardar el Artista'
				});
			} else {
				res.status(200).send({
					message: 'Datos Guadados correctamente',
					artist: artistStored
				});
			}
		}
	});
}

function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if (err) {
			res.status(500).send({
				message: 'Error en la petición'
			});
		} else {
			if (!artistUpdated) {
				res.status(404).send({
					message: 'Error al actualizar el artista'
				});
			} else {
				res.status(200).send({
					artist: artistUpdated
				});
			}
		}
	});
}

function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición' });
		} else {
			if (!artistRemoved) {
				res.status(404).send({message: 'Error al eliminar el artista'});
			} else {
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
					if (err) {
						res.status(500).send({message: 'Error en la petición' });
					} else {
						if (!albumRemoved) {
							res.status(404).send({message: 'Error al eliminar el album'});
						} else {
							Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
								if (err) {
									res.status(500).send({message: 'Error en la petición' });
								} else {
									if (!songRemoved) {
										res.status(404).send({message: 'Error al eliminar la canción'});
									} else {
										res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res) {
	var artistId = req.params.id;
	var filename = 'No subido';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		console.log(file_split);

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
				if (!artistUpdated) {
					res.status(404).send({message: 'No se ha podido actualizar el artista'});
				} else {
					res.status(200).send({artist: artistUpdated});
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
	var imagePath = './uploads/artists/' + imageFile;
	console.log(imageFile);
	
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
	getArtist,
	getArtists,
	saveArtist,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}