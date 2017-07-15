'use strict'

var express = require('express');
var UserController = require('../controllers/user.controller');

var api = express.Router();

api.get('/probando-controlador', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);

module.exports = api;