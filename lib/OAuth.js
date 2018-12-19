"use strict"

const Fs = require( 'fs' );
const Https = 

module.exports = class OAuth{
	constructor(){
		this.Endpoints = JSON.parse( Fs.readFileSync( __dirname + '/endpoints/oAuth.json' ) );
	}
}