"use strict"

const Https    = require( 'https' );
const MicroLib = require( __dirname + '/../microLib/main.js' );
const QueryString = require( 'querystring' );

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
	}
	
	/**
	 * Uses an oAuthCode to request a oAuthToken
	 * @param { Object } Options - The information required to complete this API call
	 *     @param { string } Options.authCode - The oAuthCode that was given to your client after they authorized your application
	 * @param { ApiCallback } cb - The functio to be called once the API call is complete
	 */
	async requestAccessToken( Opts, cb ){
		try {
			let response = await this._post( {
				endpoint : this.Endpoints.token,
				PostData:{
					grant_type : "authorization_code",
					code : "" + Opts.authCode,
					clientId : this.ApiCreds.clientId
				}
			} );
			cb( response, false );
		} catch( e ) { cb( false, e ) }
	}
	
	/**
	 * Refreshes an oAuth token
	 * @param { Object } Options - The data required to complete this API call
	 *     @param { string } Options.refreshToken - The refresh token you were given with your access token
	 * @param { ApiCallback } cb - The function to be called when the API call has completed
	 */
	async refreshAccessToken( Opts, cb ){
		try{			
			let response = await this._post( {
				e : this.Endpoints.refresh,
				PostData : {
					grant_type : "refresh_token",
					refresh_token : Opts.refreshToken
				}
			} );
			cb( response, false );
		} catch( e ) { cb( false, e ); }
	}
	
	_post( Opts ){
		return new Promise( ( resolve, reject ) => {
			// Make sure the POST body is in the correct form (x-www-form-urlencoded)
			Opts.PostData = QueryString.stringify( Opts.PostData );
			
			// Parse the host and endpoint from the endpoint
			let host = Opts.endpoint.substring( Opts.endpoint.indexOf('//') + 2 , Opts.endpoint.indexOf('.net/') + 4 );
			let path = Opts.endpoint.substring( Opts.endpoint.indexOf('.net') + 4, Opts.endpoint.length );
			let data = '';
			
			let request = Https.request( {
			// Request options
				host : host,
				path : path,
				port : 443,
				method: "POST",
				headers: {
					"Authorization"  : "Basic " + new Buffer.from( this.ApiCreds.clientId + ":" + this.ApiCreds.oAuthSecret ).toString( 'base64' ),
					"User-Agent"     : this.ApiCreds.userAgent,
					"Content-Type"   : "application/x-www-form-urlencoded",
					"Content-length" : Opts.PostData.length
				}
			// Capture the response
			}, Response => {
				Response.on( 'data', chunk => {
					data += chunk;
				} );
				
				Response.on( 'end', () => {
					try{
						data = JSON.parse( data );
					} catch(e) { console.log( data ) };
					
					// If the request was successful resolve the promise, otherwise reject it.
					if( typeof data.error === 'undefined' ){
						resolve( data );	
					} else {
						reject( new MicroLib.ApiError( data ) );
					}
				} );
			} );
			
			request.write( Opts.PostData );
			request.end();
		} );

	}
	
	_get( endpoint, PostData = {} ){
		
		let	headers = {
			"X-API-KEY": this.ApiCreds.key,
			"User-Agent": this.ApiCreds.userAgent
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
						reject( new MicroLib.ApiError( data ) );
					}
					
				} );
			} );
		} );
	}
	
	/** see http://slavik.meltser.info/the-efficient-way-to-create-guid-uuid-in-javascript-with-explanation/ for more info */
	_guid() {
		function _p8(s) {
			var p = (Math.random().toString(16)+"000000000").substr(2,8);
			return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
		}
		
		return _p8() + _p8(true) + _p8(true) + _p8();
	}
}

module.exports = OAuth;