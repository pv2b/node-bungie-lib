"use strict"
const Fs       = require( 'fs' );
const Https    = require( 'https' );
const ApiError = require( __dirname + '/../moduleLib/ApiError.js' );

/**
 * Wraps all User endpoints of the Bungie.net API
 * @class
 */
class User{
	/**
	 * @constructor
	 * @param { ApiAuth } ApiAuth - An object containing your API credentials
	 */
	constructor( ApiAuth ){
		if( typeof ApiAuth.userAgent !== "string" )
			throw new Error( 'ApiAuth expected to be string, got ' + typeof ApiAuth.userAgent);
		if( typeof ApiAuth.key !== "string" )
			throw new Error( 'ApiAuth expected to be string, got ' + typeof ApiAuth.key);
		
		
		this.ApiAuth   = ApiAuth;
		this.Endpoints = JSON.parse ( Fs.readFileSync( __dirname + '/endpoints.json' ) );
		this.render    = require(  __dirname + '/../moduleLib/UriRenderer.js' );
		this.userAgent = ApiAuth.userAgent;
	}
	
	
	/**
	 * Searches for a Bungie.net user. Wraps this endpoint https://bungie-net.github.io/multi/operation_get_User-SearchUsers.html#operation_get_User-SearchUsers
	 * @param { Object } Options - Contains the data required for this API call
	 *   @property { string } Options.apiKey - The apiKey that you were given when you created your project at https://www.bungie.net/en/Application
	 *   @property { string } Options.search - The user you want to search for
	 * @param { function } Callback - The function to be called once the API call has finished
	 * @return { Promise } Resolves with the parsed API response: Rejects with any error that occurs during the process
	 */
	async getSearchUsers( Opts, cb ){
		if( typeof Opts.search !== 'string'){
			cb( false, new Error("Options.search expected to be string, got " + Opts.search) )
		} else {
			try{
				let resp = await this._get( this.Endpoints.getSearchUsers + "?q=" + encodeURI( Opts.search ) );
				cb( resp, false );
			}
			catch( e ){
				cb( false, e );
			}
		}
	}
	
	/**
	 * Retrieves information about a user. Wraps this endpoint https://bungie-net.github.io/multi/operation_get_User-GetBungieNetUserById.html#operation_get_User-GetBungieNetUserById
	 * @param { Object } Options - Contains the data required for this API call
	 *   @property { string } Options.id - The requested Bungie.net membership ID
	 * @param { function } Callback - The function to be called once the API call is finished
	 */
	async getBungieNetUserById( Opts, cb ){
		if( ! parseInt( Opts.id ) ){
			cb( false, new Error( "Options.id expected to be number-like (string containing numbers, or actual integers), got " + typeof Opts.id ));
		} else {
			// Try to generate a valid response
			try{
				let uri  = await this.render( this.Endpoints.getBungieNetUserById, { id : Opts.id } );
				let resp = await this._get( uri );
				// Generated a valid response
				cb( resp, false );
			// Failed to generate a valid response
			}catch( e ){
				cb( false, e );
			}
		}
	}
	
	/**
	 * Retrieves a list of all available user themes
	 * @param { function } Callback - A function to be called once the API call is complete
	 */
	async getAvailableThemes( cb ){
		// Try to generate a valid response
		try{
			let resp = await this._get( this.Endpoints.getAvailableThemes );
			// Generated a valid response
			cb( resp, false );
		}
		// Failed to generated a valid response
		catch( e ){
			cb( false, e );
		}
	}
	/**
	 * Retrieves a list of accounts associated with the supplied membership ID and membership type. This will include all linked accounts (even when hidden) if supplied credentials permit it.
	 * @param { Object } Options - Contains the data requried for this API call
	 *   @property { string } Options.membershipId - The membership ID of the target user
	 *   @property { string } Options.membershipType - Type of the supplied membership ID
	 * @param { function } - Callback - A function to be called once the API call is finished
	 */
	async getMembershipDataById( Opts, cb ){
		
		// Make sure that we have all of the options that we need
		if( typeof Opts.membershipId !== 'string'){
			cb( false, new Error( 'Options.mambershipId expected to be string, got ' + typeof Opts.membershipId) );
		}else if( typeof Opts.membershipType !== 'string'){
			cb( false, new Error( 'Options.membershipType expected to be string, got ' + typeof Opts.membershipType) );
		}else{
			// Try to generate a response
			try{
				let uri  = await this.render( this.Endpoints.getMembershipDataById, { membershipId: Opts.membershipId, membershipType: Opts.membershipType } )
				let resp = await this._get( uri );
				
				// Generated a valid response
				cb( resp, false )
			// Couldn't generate a valid response
			}catch( e ){
				cb( false, e );
			}
			
		}		
		
	}
	
	/**
	 * Retrieves a users linked Partnerships
	 * @param { Object } Options - Contain the data required for this API all
	 *   @property { number-like } Options.id - The ID of the member for whom partnerships should be returned
	 * @param { function } Callback - The function to be called when the API call is complete
	 */
	async getPartnerships( Opts, cb ){
		if( !parseInt( Opts.membershipId ) ){
			cb( false, new Error( "Options.membershipId expected to be number-like, got " + typeof Opts.id ) );
		} else {
			try{
				let uri = await this.render( this.Endpoints.getPartnerships, { membershipId: Opts.membershipId } );
				let resp = await this._get( uri );
				cb( resp, false );
			}catch( e ){
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

module.exports = User;