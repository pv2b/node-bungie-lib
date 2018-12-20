"use strict"

const Fs = require( 'fs' );

module.exports = class OAuth{
	constructor(){
		this.Endpoints = JSON.parse( Fs.readFileSync( __dirname + '/endpoints.json' ) );
	}
}