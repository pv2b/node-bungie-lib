"use strict"
const Fs       = require( 'fs' );
const Https    = require( 'https' );
const ApiError = require( __dirname + '/classLib/ApiError.js' );
module.exports = class User{
	/**
	 * Wraps the User endpoints of the Bungie.net API
	 * @constructor
	 */
	constructor( ApiAuth ){
		this.ApiAuth   = ApiAuth;
		this.rootPath  = JSON.parse( Fs.readFileSync( __dirname + '/endpoints.json' ) ).rootPath;
		this.Endpoints = JSON.parse( Fs.readFileSync( __dirname + '/endpoints.json' ) ).User;
		this.render  = require(  __dirname + '/classLib/UriRenderer.js' );
		
		// HARD CODED FOR DEBUGGIN PURPOSES ONLY!!!
		this.userAgent = "destiny-2-dashboard/0.0.1 AppId/25330 (+dev.tylermeador.com;ty@tylermeador.com)";
	}
	
	
	/**
	 * Searches for a bungie.net user. Wraps this endpoint https://bungie-net.github.io/multi/operation_get_User-SearchUsers.html#operation_get_User-SearchUsers
	 * @param { string } apiKey - The apiKey that you were given when you created your project at https://www.bungie.net/en/Application
	 * @param { string } queryString - The user you want to search for
	 * @return { Promise } Resolves with the parsed api response: Rejects with any error that occurs during the process
	 */
	getSearchUsers( queryString ){
		// URI encode the search string
		queryString = encodeURI( queryString );
		return this._get( this.Endpoints.getSearchUsers + "?q=" + queryString );		
	}
	
	getBungieNetUserById( id ){
		let uri = this.render( this.Endpoints.getBungieNetUserById, { id : id } );
		return this._get( uri );
	}
	
	getAvailableThemes(){
		return this._get( this.Endpoints.getAvailableThemes );
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
						throw new ApiError( data );
					}
					
				});
			});
		} );
	}
	_post(){
		
	}
}