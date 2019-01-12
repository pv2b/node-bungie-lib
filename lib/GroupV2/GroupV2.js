/** @module GroupV2 */
"use strict"


class GroupV2 {
	constructor(){
		
	}
	
	_get( endpoint, oAuth = false ){
		return new Promise( ( resolve, reject ) => {
			
			let	headers = {
				"X-API-KEY": this.ApiCreds.key,
				"User-Agent": this.userAgent
			}
			
			// Send the authorization header if they provide their access token
			if( typeof oAuth == 'object' ){
				headers["Authorization"] = "Bearer " + oAuth.access_token;
			}
			
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
						reject( data );
					}
				} );
			} );
		} );
	}
	
	_post( Opts ){
		return new Promise( ( resolve, reject ) => {
			// Make sure the POST body is in the correct form (x-www-form-urlencoded)
			Opts.PostData = ( typeof Opts.PostData == 'object' ) ? Opts.PostData : "";
			Opts.PostData = QueryString.stringify( Opts.PostData );
			
			// Parse the host and endpoint from the endpoint
			let host = Opts.endpoint.substring( Opts.endpoint.indexOf('//') + 2 , Opts.endpoint.indexOf('.net/') + 4 );
			let path = Opts.endpoint.substring( Opts.endpoint.indexOf('.net') + 4, Opts.endpoint.length );
			let data = '';
			
			let reqOptions = {
				host : host,
				path : path,
				port : 443,
				method: "POST",
				headers: {
					"User-Agent"     : this.ApiCreds.userAgent,
					"Content-Type"   : "application/x-www-form-urlencoded",
					"Content-length" : Opts.PostData.length
				}
			}
			 /** Add the authorization header if the user supplied it */
			if( typeof Opts.oAuth == 'object' )
				reqOptions.headers.Authorization = "Bearer " + Opts.oAuth.access_token;
			
			let request = Https.request( reqOptions, Response => {
				Response.on( 'data', chunk => {
					data += chunk;
				} );
				
				Response.on( 'end', () => {
					try{
						data = JSON.parse( data );
					} catch(e) { console.log( data ) };
					
					// If the request was successful resolve the promise, otherwise reject it.
					if( data.ErrorCode === 0 || data.ErrorCode === 1 ){
						resolve( data );	
					} else {
						reject( new MicroLib.ApiError( data ) );
					}
				} );
			} );
			
			request.on('error', e => {
				reject( e );
			} );
			
			// If we have data to post, post it.
			if( Opts.PostData !== '' )
				request.write( Opts.PostData );
			request.end();
		} );

	}
}