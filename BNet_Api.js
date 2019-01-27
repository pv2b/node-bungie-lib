"use strict"

const Fs = require ( 'fs' );
const Path = require( 'path' );
const MicroLib = require( __dirname + "/lib/MicroLibrary.js" );
var Request = null;

class BNet_Api{
	/**
	 * Wraps the endpoint micro-libraries to make API management easier. While
	 * the micro-libraries are designed to be modular and can operate fully independent
	 * of this wrapper; I strongly suggest you start by using the wrapper. It's very handy ;)
	 * @constructor
	 * @param { ApiCreds } ApiCreds - An Object containing your API credentials
	 * @param { array } loadMicroLibs - An array containing the names of the micro-libraries that you want to load
	 * @example
	 * var ApiCreds = {
	 *    key : "my_super_secret_api_key",
	 *    clientId: "my_client_id",
	 *    userAgent : "MyApp/0.2.3 AppId/MyAppId (+myProjectUrl;mycontact@email.com)"
	 * }
	 *
	 * var BNetApi = require( 'bungie-net-api' );
	 *
	 * // Only load the destiny2 and user libraries
	 * const Api = new BNetApi( ApiCreds, ['destiny2', 'user'] );
	 */
	constructor( ApiCreds, loadMicroLibs = ['all'] ){
		
		Request = Ml.Request( ApiCreds );
		
		// Sanity check
		if( typeof ApiCreds.key !== 'string')
			throw new TypeError( { varName: 'ApiCreds.key', variable: ApiCreds.key, expected: 'string' } );
		if( ! parseInt( ApiCreds.clientId ) )
			throw new TypeError( { varName: 'ApiCreds.clientId', variable: ApiCreds.clientId, expected: 'string' } );

		if( typeof ApiCreds.userAgent !== 'string')
			ApiCreds.userAgent = MicroLib.defaultUserAgent();

		this.ApiCreds = ApiCreds;
		this.microLibs = {}

		// Parse the array of micro-libraries
		JSON.parse ( Fs.readFileSync( __dirname + '/microLibs.json' ) ).forEach( microLib => {
			this.microLibs[microLib.name] = microLib;
		});

		// Loads all modules by default
		if( ! Array.isArray( loadMicroLibs ) ) {
			console.warn( "Warning, loadModules was expected to be an array, got " + typeof loadMicroLibs );
			console.warn( "-=-=-=-=- Loading all modules by default -=-=-=-=-" );
			loadMicroLibs = ['all'];
		}

		// Load all micro-libraries
		if( loadMicroLibs[0] == 'all' ){
			// For each microLib with an entry in modules.json
			Object.keys( this.microLibs ).forEach( key => {
				let ml = this.microLibs[key];
				// Try to create an instance of the microLib and store it to this[microLib_name]
				try{
					this[ml.wrapperKey] = new( require( __dirname + ml.path + ml.main ) )( this.ApiCreds );
				} catch( e ){
					throw new MicroLib.MicroLibLoadError( {
						message : "The microLib " + this.microLibs[key].name + " failed to load",
						reason : e,
						microLib : this.microLibs[key]
					} );
				}
			} )
		// Load only the preferred micro-libraries
		} else {
			loadMicroLibs.forEach( microLibName => {
				// Is there an entry for this microLib in microLibs.json?
				if( typeof this.microLibs[microLibName] !== 'object' ){
					// Nope!, throw an error
					throw new MicroLib.MicroLibLoadError({
						message: "The micro-library " + microLibName + " failed to load",
						reason: "The micro-library " + microLibName + " does not have an entry in modules.json"
					});
				// Yep! try to load it
				} else {
					// cache the micro-library in question
					let ml = this.microLibs[microLibName];

					// Try to create a new instance of the microLib
					try{
						this[ml.wrapperKey] = new( require( __dirname + ml.path + ml.main ) )( this.ApiCreds );
					// Something went wrong, panic and run in a circle
					}catch( e ){
						throw new MicroLib.MicroLibLoadError({
							message: "The micro-library " + microLibName + " failed to load",
							reason : e,
							microLib: this.microLibs[microLibName]
						});
					}
				}
			} );
		}
		this.authUri = this.OAuth.authUri;
	}
	
	/**
	 * List of available localization cultures
	 * @returns { Promise }
	 */
	getAvailableLocales(){
		return Request.get( "https://www.bungie.net/Platform/GetAvailableLocales/" );
	}
	
	/**
	 * Get the common settings used by the Bungie.Net environment.
	 * @returns { Promise }
	 */
	getCommonSettings(){
		return Request.get( "https://www.bungie.net/Platform/Settings/" );
	}
	
	/**
	 * Gets any active global alert for display in the forum banners, help pages, etc. Usually used for DOC alerts.
	 * @param { boolean } [includeStreaming=true] - Determines whether Streaming Alerts are included in results
	 */
	getGlobalAlerts( includestreaming = true ){
		return Ml.renderEndpoint( '/GlobalAlerts/', {}, { includestreaming } )
			.then( endpoint => Request.get( "https://www.bungie.net/Platform" + endpoint ) );
	}
}

module.exports = BNet_Api;
