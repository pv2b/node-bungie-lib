"use strict"
const Fs       = require( 'fs' );
const Https    = require( 'https' );
const ApiError = require( __dirname + '/classLib/ApiError.js' );

/**
 * Wraps the Content endpoints of the Bungie.net API
 * @class
 */
class Content{
	constructor( ApiAuth ){
		if( typeof ApiAuth.userAgent !== "string" )
			throw new Error( 'ApiAuth expected to be string, got ' + typeof ApiAuth.userAgent);
		if( typeof ApiAuth.key !== "string" )
			throw new Error( 'ApiAuth expected to be string, got ' + typeof ApiAuth.key);
		
		let temp = JSON.parse( Fs.readFileSync( __dirname + '/endpoints.json' ) );
		this.ApiAuth   = ApiAuth;
		this.rootPath  = temp.rootPath;
		this.Endpoints = temp.Content;
		this.render    = require(  __dirname + '/classLib/UriRenderer.js' );
		this.userAgent = ApiAuth.userAgent;
	}
	
	/**
	 * @param { Object } Options - The data required for this API call
	 *   @property { string } Options.type - The type of content
	 * @param { function } callback - The function to be called once this API call has completed
	 */
	async getContentType( Opts, cb ){
		
		if( typeof Opts.type !== 'string' ){
			cb( false, new Error( " Options.type expected to be string, got " + typeof Opts.id ) );
		} else {
			// Try to generate a valid response
			try{
				let uri = await this.render( this.Endpoints.getPartnerships, { membershipId: Opts.membershipId } );
				let resp = await this._get( uri );
				// Generated a valid response
				cb( resp, false );
			//Failed to generate a valid response
			}catch(e){
				
				cb( false, e );
			}
		}
	}
	
	_get( endpoint, Params = {} ){
		
		let	headers = {
			"X-API-KEY": this.ApiAuth.key,
			"User-Agent": this.userAgent
		}	
		return new Promise( ( resolve, reject ) => {
			Https.get( this.rootPath + endpoint, { headers: headers }, res => { 
				let data = '';
				
				// A chunk of data has been received.
				res.on('data', (chunk) => {
					data += chunk;
				});

				// The whole response has been received. Print out the result.
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

module.exports = Content;