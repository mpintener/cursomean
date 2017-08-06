'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'claveSecreta';

exports.createToken = function(user){
	// datos que se van a codificar
	var payload = {
		sub: user._id,
		name: user.first_name,
		lastName: user.last_name,
		rol: user.role,
		image: user.image,
		iat: moment().unix(), //Token creation date
		exp: moment().add(30, 'days').unix // Expiration date
	}
	//  Secret es para que genere el hash con una clave secreta
	return jwt.encode(payload, secret);
};