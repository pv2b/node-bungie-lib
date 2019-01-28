"use strict"

const Fs = require ( 'fs' );
const Path = require( 'path' );
const Ml = require( __dirname + "/lib/MicroLibrary.js" );
var Request = null;

class BungieLib{
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
		
		Request = new Ml.Request( ApiCreds );
		
		// Sanity check
		if( typeof ApiCreds.key !== 'string')
			throw new TypeError( { varName: 'ApiCreds.key', variable: ApiCreds.key, expected: 'string' } );
		if( ! parseInt( ApiCreds.clientId ) )
			throw new TypeError( { varName: 'ApiCreds.clientId', variable: ApiCreds.clientId, expected: 'string' } );

		if( typeof ApiCreds.userAgent !== 'string')
			ApiCreds.userAgent = Ml.defaultUserAgent();

		this.ApiCreds = ApiCreds;
		this.MicroLibs = {}

		// Parse the array of micro-libraries
		JSON.parse ( Fs.readFileSync( __dirname + '/microLibs.json' ) ).forEach( MicroLib => {
			this.MicroLibs[ MicroLib.name ] = MicroLib;
		});

		// Loads all modules by default
		if( ! Array.isArray( loadMicroLibs ) ) {
			console.warn( "Warning, loadModules was expected to be an array, got " + typeof loadMicroLibs );
			console.warn( "-=-=-=-=- Loading all modules by default -=-=-=-=-" );
			loadMicroLibs = ['all'];
		}

		// Load all micro-libraries
		if( loadMicroLibs[0] == 'all' ){
			// For each Ml with an entry in modules.json
			Object.keys( this.MicroLibs ).forEach( key => {
				let ml = this.MicroLibs[ key ];
				// Try to create an instance of the Ml and store it to this[Ml_name]
				try{
					this[ ml.wrapperKey ] = new( require( __dirname + ml.path + ml.main ) )( this.ApiCreds );
				} catch( e ){
					throw new Ml.MicroLibLoadError( {
						message : "The Micro-library " + this.MicroLibs[ key ].name + " failed to load",
						reason : e,
						MicroLib : this.MicroLibs[ key ]
					} );
				}
			} )
		// Load only the preferred micro-libraries
		} else {
			loadMicroLibs.forEach( mlName => {
				// Is there an entry for this Ml in Mls.json?
				if( typeof this.MicroLibs[ mlName ] !== 'object' ){
					// Nope!, throw an error
					throw new Ml.MlLoadError({
						message: "The micro-library " + mlName + " failed to load",
						reason: "The micro-library " + mlName + " does not have an entry in modules.json"
					});
				// Yep! try to load it
				} else {
					// cache the micro-library in question
					let ml = this.MicroLibs[MlName];

					// Try to create a new instance of the Ml
					try{
						this[ml.wrapperKey] = new( require( __dirname + ml.path + ml.main ) )( this.ApiCreds );
					// Something went wrong, panic and run in a circle
					}catch( e ){
						throw new Ml.MicroLibLoadError({
							message: "The micro-library " + mlname + " failed to load",
							reason : e,
							MicroLib: this.MicroLibs[ mlName ]
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

module.exports = BungieLib;
