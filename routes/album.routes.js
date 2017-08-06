'use strict'

var express = require('express');
var AlbumController = require('../controllers/album.controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/albums'});

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/delete-album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);
api.get('/albums/:page?', md_auth.ensureAuth, AlbumController.getAlbums);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);

module.exports = api;

