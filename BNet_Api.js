"use strict"

const Fs = require ( 'fs' );
const Path = require( 'path' );

/**
 * Wraps the endpoint micro-libraries to make API management easier. While
 * the micro-libraries are designed to be modular and can operate fully independent
 * of this wrapper; I strongly suggest you start by using the wrapper. It's very handy ;)
 * @class
 */
class BNet_Api{
	/**
	 * Initializes all specified libraries
	 * @param { Object } ApiAuth - The ApiAuthorization 
	 */
	constructor( ApiAuth, modules = ['all'] ){
		
		// Sanity check
		if( typeof ApiAuth.key !== 'string')
			throw new Error( "your key '" + ApiAuth.key + "' appears to be invalid. Is it a string?" );
		if( ! parseInt( ApiAuth.clientId ) )
			throw new Error( "The clientId '" + ApiAuth.clientId + "' could not be parsed" );
		
		this.ApiAuth = ApiAuth;
		
		// Loads all modules by default
		if( ! Array.isArray( modules ) || modules[0] == 'all' ){
			
			// Read everything in the lib folder
			Fs.readdirSync( __dirname + '/lib').forEach( file => {
				
				// If it's a js file, create a new instance of it
				if( Path.extname(file) == '.js'){
					let fileName = file.substring(0, file.length - 3);
					
					this[ fileName ] = new (require( __dirname + "/lib/" + file))( this.ApiAuth );
				}
			});
		} else {
			// Implement loading of individual modules later
		}
	}
}

module.exports = BNet_Api;