"use strict"

const Fs = require ( 'fs' );
const Path = require( 'path' );

class Wrapper{
	
	
	/**
	 *
	 */
	constructor( ApiAuth, modules = "" ){
		
		// Sanity check
		if( typeof ApiAuth.key !== 'string')
			throw new Error( "your key '" + ApiAuth.key + "' appears to be invalid. Is it a string?" );
		if( ! parseInt( ApiAuth.clientId ) )
			throw new Error( "The clientId '" + ApiAuth.clientId + "' could not be parsed" );
		
		// Loads all modules by default
		if( ! Array.isArray( modules )){
			
			// Read everything in the lib folder
			Fs.readdirSync( __dirname + '/lib').forEach( file => {
				
				// If it's a js file, create a new instance of it
				if( Path.extname(file) == '.js'){
					let fileName = file.substring(0, file.length - 4);
					
					this[ fileName ] = new (require( __dirname + "/lib/" + file))();
				}	
			});
		} else {
			// Implement loading of individual modules later
		}
		
		this.User = new( require("./lib/User.js") );
		/*this.User.getSearchUsers( "xXTy Meador73Xx" );*/
	}
}


module.exports = Wrapper;