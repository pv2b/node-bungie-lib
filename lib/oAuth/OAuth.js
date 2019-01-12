/** @module OAuth */
"use strict"
 
const Https    = require( 'https' );
const MicroLib = require( __dirname + '/../microLib/main.js' );
const QueryString = require( 'querystring' );
var Request = null;

class OAuth{
	/**
	 * Takes care of oAuth API calls for you
	 * @constructor
	 * @param { ApiCreds } ApiCreds - An object containing your API credentials
	 */
	constructor( ApiCreds ){
		this.ApiCreds  = ApiCreds;
		this.Endpoints = require( __dirname + '/endpoints.js' );
		this.authUri   = this.Endpoints.authorization + "?response_type=code&client_id=" + this.ApiCreds.clientId;
		Request = new MicroLib.Request( ApiCreds ) ;
	}
	
	/**
	 * Uses an oAuthCode to request a oAuthToken
	 * @param { string } authCode - The oAuthCode that was given to your client after they authorized your application
	 * @example
	 * OAuth.requestAccessToken( Opts ).then( auth => {
	 *     console.log( auth ); // Do something with the api response
	 * }).catch( e => {
	 *    // Error handling
	 * });
	 */
	async requestAccessToken( authCode = "NO_CODE_PROVIDED" ){
		return Request.post( 
			this.rootPath + this.Endpoints.token ,
			{
				grant_type : "authorization_code",
				code : "" + authCode,
				clientId : this.ApiCreds.clientId
			}
		);
	}
	
	/**
	 * Refreshes an oAuth token
	 * @param { string } refreshToken - The refresh token you were given with your access token
	 * @example
	 * OAuth.refreshAccessToken( Opts ).then( auth => {
	 *     console.log( auth ); // Do something with the api response
	 * }).catch( e => {
	 *    // Error handling
	 * });	 
	 */
	async refreshAccessToken( oAuth ){	
		// They can pass the entire bungie.net oAuth object, or just the refreshToken
		let refreshToken = ( typeof oAuth === 'object' ) ? oAuth.refresh_token : oAuth;
	
		return Request.post( 
			this.rootPath + this.Endpoints.refresh,
			{
				grant_type : "refresh_token",
				refresh_token : "" + refreshToken
			}
		 );
	}
}

module.exports = OAuth;