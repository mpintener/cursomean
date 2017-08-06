'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
	var songId = req.params.id;

	Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!song) {
				res.status(404).send({message: 'La canción no existe'});
			} else {
				res.status(200).send({song});
			}
		}
	});
}

function getSongs(req, res) {
	var albumId = req.params.album;
	var find;

	if (!albumId) {
		find = Song.find().sort('title');
	} else {
		find = Song.find({album: albumId}).sort('number');
	}

	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	}).exec((err, songs) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!songs) {
				res.status(404).send({message: 'No hay canciones para este album'});
			} else {
				res.status(200).send({songs});
			}
		}
	});
}

function saveSong(req, res) {
	var song = new Song();
	var params = req.body;

	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = 'null';
	song.album = params.album;

	song.save((err, songStored) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!songStored) {
				res.status(404).send({message: 'Error al guardar la cancion'});
			} else {
				res.status(200).send({
					message: 'Canción guardada correctamente',
					song: songStored
				});
			}
		}
	});
}

function updateSong(req, res) {
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!songUpdated) {
				res.status(404).send({message: 'Error al actualizar la cancion'});
			} else {
				res.status(200).send({
					message: 'Canción actualizada correctamente',
					song: songUpdated
				});
			}
		}
	});
}

function deleteSong(req, res) {
	var songId = req.params.id;

	Song.findByIdAndRemove(songId, (err, songRemoved) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!songRemoved) {
				res.status(404).send({message: 'No se ha podido borrar la cancion'});
			} else {
				res.status(200).send({
					message: 'Canción borrada correctamente',
					song: songRemoved
				});
			}
		}
	});
}

function uploadFile(req, res){
	var songId = req.params.id;
	var file_name = 'No subido...';

	if (req.files) {
		var file_path = req.files.file.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		console.log(file_split);

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if (file_ext == 'mp3' || file_ext == 'ogg') {
			Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
				if (!songUpdated) {
					res.status(404).send({message: 'No se ha podido actualizar el album'});
				} else {
					res.status(200).send({user: songUpdated});
				}
			});
		} else {
			res.status(500).send({message: 'Formato de archivo no válido.'});	
		}
	} else {
		res.status(200).send({message: 'No has subido ningun audio...'});
	}
}

function getSongFile(req, res){
	var audioFile = req.params.audioFile;
	var audioPath = './uploads/songs/' + audioFile;

	fs.exists(audioPath, function(exists){
		if (exists) {
			res.sendFile(path.resolve(audioPath));
		} else {
			res.status(200).send({
				message: 'La cancion no existe'
			});
		}
	});
}

module.exports = {
	getSong,
	getSongs,
	saveSong,
	updateSong,
	deleteSong,
	getSongFile,
	uploadFile
}