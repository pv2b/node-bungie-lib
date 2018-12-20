"use strict"

const Fs = require ( 'fs' );
const Path = require( 'path' );
const ModuleError = require( __dirname + "/lib/moduleLib/ModuleError.js");
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
	 *   @property { string } ApiAuth.key - The API key that you were given when you created your project at 
	 * @param { array } loadModules - An array of modules to load
	 */
	constructor( ApiAuth, loadMods = ['all'] ){
		
		// Sanity check
		if( typeof ApiAuth.key !== 'string')
			throw new Error( "your key '" + ApiAuth.key + "' appears to be invalid. Is it a string?" );
		if( ! parseInt( ApiAuth.clientId ) )
			throw new Error( "The clientId '" + ApiAuth.clientId + "' could not be parsed" );
		
		this.ApiAuth = ApiAuth;
		this.modules = JSON.parse ( Fs.readFileSync( __dirname + '/modules.json' ) );
		
		// Loads all modules by default
		if( ! Array.isArray( loadMods ) ) {
			console.warn( "Warning, loadModules was expected to be an array, got " + typeof loadMods);
			console.warn( "-=-=-=-=- Loading all modules by default -=-=-=-=-" );
			loadMods = ['all'];
		}	
		
		// Load all modules
		if( loadMods[0] == 'all' ){
			this.modules.forEach( module => {
				try{
					this[module.objName] = new( require( __dirname + module.path + module.main ) )( this.ApiAuth );
				} catch( e ){
					throw new ModuleError( {
						message : "The module " + module.name + " failed to load",
						reason : e,
						module : module
					} );
				}
			})
		// Load only the supplied modules
		} else {
			// Implement loading of individual modules later
		}
	}
}

module.exports = BNet_Api;