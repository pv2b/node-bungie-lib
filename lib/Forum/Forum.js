"use strict"
const Fs       = require( 'fs' );
const Https    = require( 'https' );
const ApiError = require( __dirname + '/../microLib/ApiError.js' );

/**
 * 
 * @class
 */
class Forum{
	/**
	 * Wraps all Forum endpoints of the Bungie.net API
	 * @constructor
	 * @param { ApiAuth } ApiAuth - An Object containing your API credentials.
	 * @example
	 * let ApiAuth = {
	 *   key : "my_super_secret_api_key",
     *   clientId: "my_client_id",
     *   userAgent : "MyApp/0.2.3 AppId/MyAppId (+myProjectUrl;mycontact@email.com)"	 		 
	 * }
	 *
	 * let ForumLib = require( '/path/to/Forum.js' );
	 * const Forum = new ForumLib( ApiAuth );
	 */
	constructor( ApiAuth ){
		if( typeof ApiAuth.userAgent !== "string" )
			throw new Error( 'ApiAuth expected to be string, got ' + typeof ApiAuth.userAgent);
		if( typeof ApiAuth.key !== "string" )
			throw new Error( 'ApiAuth expected to be string, got ' + typeof ApiAuth.key);
		
		this.ApiAuth   = ApiAuth;
		this.Endpoints = JSON.parse ( Fs.readFileSync( __dirname + '/endpoints.json' ) );
		this.Enums     = require( __dirname + '/enums.js');
		this.render    = require(  __dirname + '/../microLib/UriRenderer.js' );
		this.userAgent = ApiAuth.userAgent;
	}
	
	
	/**
	 * @param { Object } Options - An object containing the data what we need to complete this API call
	 *   @property { string } Options.categoryFilter - A category filter.
	 *   @property { number } Options.group - The group, if any
	 *   @property { number } Options.page - Zero paged number
	 *   @property {}
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