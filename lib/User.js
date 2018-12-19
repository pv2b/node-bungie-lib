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
		this.render    = require(  __dirname + '/classLib/UriRenderer.js' );
		
		// HARD CODED FOR DEBUGGIN PURPOSES ONLY!!!
		this.userAgent = "bungie_net_api_library_node/0.0.1 AppId/25330 (+dev.tylermeador.com;ty@tylermeador.com)";
	}
	
	
	/**
	 * Searches for a bungie.net user. Wraps this endpoint https://bungie-net.github.io/multi/operation_get_User-SearchUsers.html#operation_get_User-SearchUsers
	 * @param { string } apiKey - The apiKey that you were given when you created your project at https://www.bungie.net/en/Application
	 * @param { string } queryString - The user you want to search for
	 * @return { Promise } Resolves with the parsed api response: Rejects with any error that occurs during the process
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
	
	async getPartnerships( Opts, cb ){
		if( typeof Opts.membershipId !== 'string' ){
			cb( false, new Error( "Options.membershipId expected to be string, got " + typeof Opts.id ) );
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
					
				});
			});
		} );
	}
}