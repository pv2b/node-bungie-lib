"use strict"
const Fs = require( 'fs' );
const Https = require( 'https' );

class User{
	constructor(){
		this.rootPath  = JSON.parse( Fs.readFileSync( __dirname + '/endpoints.json' ) ).rootPath;
		this.Endpoints = JSON.parse( Fs.readFileSync( __dirname + '/endpoints.json' ) ).User;
		
		// HARD CODED FOR DEBUGGIN PURPOSES ONLY!!!
		this.userAgent = "destiny-2-dashboard/0.0.1 AppId/25330 (+dev.tylermeador.com;ty@tylermeador.com)";
	}
	
	getSearchUsers( apiKey, queryString ){
		// URI encode the search string
		queryString = encodeURI( queryString );
		
		this._get( this.Endpoints.getSearchUsers + "?q=" + queryString ).then( result => {
			console.log( result );
		});
	}
	
	_get( endpoint, method = "GET", Params = {} ){
		const _this = this;
		
		
		let	headers = {
			"X-API-KEY": 'e0f41d8f92a64a8592d7e69318590238',
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
					resolve( JSON.parse( data ) );
				});
			});
		} );
	}
	_post(){
		
	}
}

module.exports = User;