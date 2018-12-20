"use strict"
const Fs       = require( 'fs' );
const Https    = require( 'https' );
const ApiError = require( __dirname + '/../moduleLib/ApiError.js' );

/**
 * Wraps all User endpoints of the Bungie.net API
 * @class
 */
class Forum{
	/**
	 * @constructor
	 * @param { ApiAuth } ApiAuth - An Object containing your API credentials.
	 */
	constructor( ApiAuth ){
		if( typeof ApiAuth.userAgent !== "string" )
			throw new Error( 'ApiAuth expected to be string, got ' + typeof ApiAuth.userAgent);
		if( typeof ApiAuth.key !== "string" )
			throw new Error( 'ApiAuth expected to be string, got ' + typeof ApiAuth.key);
		
		this.ApiAuth   = ApiAuth;
		this.Endpoints = JSON.parse ( Fs.readFileSync( __dirname + '/endpoints.json' ) );
		this.Enums     = JSON.parse( Fs.readFileSync( __dirname + '/enums.json') );
		this.render    = require(  __dirname + '/../moduleLib/UriRenderer.js' );
		this.userAgent = ApiAuth.userAgent;
	}
	
	
	/**
	 * @param { Object } Options - An object containing the data what we need to complete this API call
	 *   @property { string } Options.categoryFilter - A category filter. See 
	 */
	async getTopicsPaged( Opts, cb ){
		
	}
	
	_get( endpoint, Params = {} ){
		
		let	headers = {
			"X-API-KEY": this.ApiAuth.key,
			"User-Agent": this.userAgent
		}	
		return new Promise( ( resolve, reject ) => {
			Https.get( this.Endpoints.rootPath + endpoint, { headers: headers }, res => { 
				let data = '';
				
				// A chunk of data has been received.
				res.on('data', (chunk) => {
					data += chunk;
				});

				// The whole response has been received.
				res.on('end', () => {
					try{
						data = JSON.parse( data );
					} catch(e) { console.log( data ) };
					
					// If the request was successful resolve the promise, otherwise reject it.
					if( data.ErrorCode === 1){
						resolve( data );	
					} else {
						reject( new ApiError( data ) );
					}
					
				} );
			} );
		} );
	}
}

module.exports = Forum;