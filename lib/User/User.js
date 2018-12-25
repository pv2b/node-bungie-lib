"use strict"
const Fs       = require( 'fs' );
const Https    = require( 'https' );
const MicroLib = require( __dirname + '/../microLib/main.js');


class User{
	/**
	 * Wraps all User endpoints of the Bungie.net API
	 * @constructor
	 * @param { ApiAuth } ApiAuth - An object containing your API credentials
	 * @example	 
	 * let ApiAuth = {
	 *   key : "my_super_secret_api_key",
     *   clientId: "my_client_id",
     *   userAgent : "MyApp/0.2.3 AppId/MyAppId (+myProjectUrl;mycontact@email.com)"	 
	 * }
	 *
	 * let UserLib = require( '/path/to/User.js' );
	 * let User = new UserLib( ApiAuth );
	 */
	constructor( ApiAuth ){		
		this.ApiAuth   = ApiAuth;
		this.Endpoints = JSON.parse ( Fs.readFileSync( __dirname + '/endpoints.json' ) );
		this.userAgent = ApiAuth.userAgent;
		this.Enums     = require( __dirname + '/Enums.js');
	}
	
	
	/**
	 * Searches for a Bungie.net user. Wraps this endpoint https://bungie-net.github.io/multi/operation_get_User-SearchUsers.html#operation_get_User-SearchUsers
	 * @param { Object } Options - Contains the data required for this API call
	 *   @property { string } Options.search - The user you want to search for
	 * @param { apiCallback } callback - The function to be called once the API call has finished
	 * @see {@link https://bungie-net.github.io/multi/operation_get_User-SearchUsers.html#operation_get_User-SearchUsers | User.getSearchUsers} for more information
	 * @example
	 * User.searchUsers( { search : 'some_user_name'}, ( Response, err ) => {
	 *     if( err !== false ){
	 *        //Error handling
	 *     } else {
     *        console.log( Response ); // Do something with the API response
	 *     }
	 * } );
	 */
	async searchUsers( Opts, cb ){		
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
	 * @param { apiCallback } callback - The function to be called once the API call is finished
	 * @see {@link https://bungie-net.github.io/multi/operation_get_User-GetBungieNetUserById.html#operation_get_User-GetBungieNetUserById | User.getBungieNetUserById} for more information
	 * @example
	 * User.getBungieNetUserById( { id : "valid_bungie.net_membership_id"}, ( Response, err ) => {
	 *     if( err !== false ){
     *          //error handling
	 *     } else {
     *          console.log( Response ); // Do something with the API response
	 *     }     
	 * });
	 */
	async getBungieNetUserById( Opts, cb ){
		if( isNaN( parseInt( Opts.id ) ) ){
			cb( false, new MicroLib.TypeError( { varName: "Options.id", variable: Opts.id, expected: "number-like" } ) );
		} else {
			// Try to generate a valid response
			try{
				let uri  = await MicroLib.render( this.Endpoints.getBungieNetUserById, { id : Opts.id } );
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
	 * @param { apiCallback } callback - A function to be called once the API call is complete
	 * @see {@link https://bungie-net.github.io/multi/operation_get_User-GetAvailableThemes.html#operation_get_User-GetAvailableThemes | User.getAvailbleThemes} for more information
	 * @example
	 * User.getAvailableThemes( ( Response, err ) => {
	 *     if( err !== false ) {
	 *         // Error handling
	 *     } else {
	 *         console.log( Response ); // Do something with the API response
	 *     }
	 * });
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
	 * @param { Object } Options - Contains the data required for this API call
	 *   @property { string } Options.membershipId - The membership ID of the target user
	 *   @property { string } Options.membershipType - Type of the supplied membership ID
	 * @param { apiCallback } - callback - A function to be called once the API call is finished
	 * @see {@link https://bungie-net.github.io/multi/operation_get_User-GetMembershipDataById.html#operation_get_User-GetMembershipDataById | User.getMembershipDataById} for more information
	 * @example
	 * User.getMembershipDataById( { membershipId : "valid_bungie.net_membership_id", membershipType : "membership_type"}, ( Response, err ) => {
	 *     if( err !== false ) {
	 *         // Error handling
	 *     } else {
	 *         console.log( Response ); // Do something with the API response
	 *     }
	 * } );
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
				let uri  = await MicroLib.render( this.Endpoints.getMembershipDataById, { membershipId: Opts.membershipId, membershipType: Opts.membershipType } )
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
	 * @param { apiCallback } Callback - The function to be called when the API call is complete
	 * @see {@link https://bungie-net.github.io/multi/operation_get_User-GetPartnerships.html#operation_get_User-GetPartnerships | User.getPartnerships} for more information
	 * @example
	 * User.getPartnerships( { id : "valid_bungie.net_membershp_id" }, ( Response, err ) => {
	 *     if( err !== false ) {
	 *         // Error handling
	 *     } else {
	 *         console.log( Response ); // Do something with the API response
	 *     }
	 * });
	 */
	async getPartnerships( Opts, cb ){
		if( !parseInt( Opts.membershipId ) ){
			cb( false, new Error( "Options.membershipId expected to be number-like, got " + typeof Opts.id ) );
		} else {
			try{
				let uri = await MicroLib.render( this.Endpoints.getPartnerships, { membershipId: Opts.membershipId } );
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