"use strict"

const Fs = require ( 'fs' );
const Path = require( 'path' );
const MicroLibLoadError = require( __dirname + "/lib/microLib/MicroLibLoadError.js");

class BNet_Api{
	/**
	 * Wraps the endpoint micro-libraries to make API management easier. While
	 * the micro-libraries are designed to be modular and can operate fully independent
	 * of this wrapper; I strongly suggest you start by using the wrapper. It's very handy ;)
	 * @constructor
	 * @param { ApiAuth } ApiAuth - An Object containing your API credentials
	 * @param { array } loadMicroLibs - An array containing the names of the micro-libraries that you want to load
	 * @example
	 * var ApiAuth = {
	 *    key : "my_super_secret_api_key",
	 *    clientId: "my_client_id",
	 *    userAgent : "MyApp/0.2.3 AppId/MyAppId (+myProjectUrl;mycontact@email.com)"
	 * }
	 *
	 * var BNetApi = require( 'bungie-net-api' );
	 *
	 * // Only load the destiny2 and user libraries
	 * const Api = new BNetApi( ApiAuth, ['destiny2', 'user']);
	 */
	constructor( ApiAuth, loadMicroLibs = ['all'] ){
		
		// Sanity check
		if( typeof ApiAuth.key !== 'string')
			throw new Error( "your key '" + ApiAuth.key + "' appears to be invalid. Is it a string?" );
		if( ! parseInt( ApiAuth.clientId ) )
			throw new Error( "The clientId '" + ApiAuth.clientId + "' could not be parsed" );
		
		this.ApiAuth = ApiAuth;
		this.microLibs = {}
		
		// Parse the array of micro-libraries
		JSON.parse ( Fs.readFileSync( __dirname + '/microLibs.json' ) ).forEach( microLib => {
			this.microLibs[microLib.name] = microLib;
		});
		
		// Loads all modules by default
		if( ! Array.isArray( loadMicroLibs ) ) {
			console.warn( "Warning, loadModules was expected to be an array, got " + typeof loadMicroLibs);
			console.warn( "-=-=-=-=- Loading all modules by default -=-=-=-=-" );
			loadMicroLibs = ['all'];
		}	
		
		// Load all micro-libraries
		if( loadMicroLibs[0] == 'all' ){
			// For each microLib with an entry in modules.json
			Object.keys( this.microLibs ).forEach( key => {
				// Try to create an instance of the microLib and store it to this.{microLib name}. 
				try{
					this[this.microLibs[key].wrapperKey] = new( require( __dirname + this.microLibs[key].path + this.microLibs[key].main ) )( this.ApiAuth );
				} catch( e ){
					throw new MicroLibLoadError( {
						message : "The microLib " + this.microLibs[key].name + " failed to load",
						reason : e,
						microLib : this.microLibs[key]
					} );
				}
			})
		// Load only the preferred micro-libraries
		} else {
			loadMicroLibs.forEach( microLibName => {
				// Is there an entry for this microLib in microLibs.json?
				if( typeof this.microLibs[microLibName] !== 'object'){
					// Nope!, throw an error
					throw new MicroLibLoadError({
						message: "The micro-library " + microLibName + " failed to load",
						reason: "The micro-library " + microLibName + " does not have an entry in modules.json"
					});
				// Yep! try to load it
				} else {
					// cache the micro-library in question
					let microLib = this.microLibs[microLibName];
					
					// Try to create a new instance of the microLib
					try{
						this[microLib.wrapperKey] = new( require( __dirname + microLib.path + microLib.main ) )( this.ApiAuth );
					// Something went wrong, panic and run in a circle
					}catch( e ){
						throw new MicroLibLoadError({
							message: "The micro-library " + microLibName + " failed to load",
							reason : e,
							microLib: this.microLibs[microLibName]
						});
					}
				}
			} );
		}
	}
}

module.exports = BNet_Api;