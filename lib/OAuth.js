"use strict"

const Fs = require( 'fs' );
const Https = 

module.exports = class OAuth{
	constructor(){
		// Temporarily load all the endpoints.
		let temp = Fs.readFileSync( __dirname + "/endpoints.json");
		// Only keep the endpoints that we actually need
		this.Endpoints = {
			authorization : temp.authorization,
			token: temp.token,
			
		}
	}
}