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

module.exports = {
	getArtist,
	getArtists,
	saveArtist
}