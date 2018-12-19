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
		
		this.ApiAuth   = ApiAuth;
		this.Endpoints = JSON.parse( Fs.readFileSync( __dirname + '/endpoints/content.json'))
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
			cb( false, new Error( "Options.type expected to be string, got " + typeof Opts.type ) );
		} else {
			// Try to generate a valid response
			try{
				let uri = await this.render( this.Endpoints.getContentType, { type: Opts.type } );
				let resp = await this._get( uri );
				// Generated a valid response
				cb( resp, false );
			//Failed to generate a valid response
			}catch(e){
				cb( false, e );
			}
		}
	}
	
	/**
	 * @param { Object } Options - The data required for this API call
	 *   @property { string|number } Options.id - The id of the content
	 *   @property { string } Options.locale - The locale in which to search for the ID
	 * @param { function } callback - The function to be called once this API call has completed
	 */
	async getContentById( Opts, cb ){
		if( !parseInt( Opts.id ) ){
			cb(false, new Error( "Options.id expected to be number-like, got " + typeof Opts.id ) );
		}else if( typeof Opts.locale !== 'string' ){
			cb( false, new Error( "Options.locale expected to be string, got " + typeof Opts.locale ) );
		} else {
			try{
				let uri = await this.render( this.Endpoints.getContentById, { id: Opts.id, locale: Opts.locale } );
				let resp = await this._get( uri );
				cb( resp, false );
			} catch(e){
				cb( false, e );
			}
		}
	}
	
	/**
	 * @param { Object } Options - The data required for this API call
	 *   @property { string } Options.locale - The locale you want to search
	 *   @property { string } Options.tag - The tag you want to search for
	 *   @property { string } Options.type - The type of content you want to search for
	 * @param { function } callback - The function to be called once this API call completes
	 */
	async getContentByTagAndType( Opts, cb ){
		if( typeof Opts.locale !== 'string' ){
			cb( false, new Error("Options.locale expected to be string, got " + typeof Opts.locale ) );
		} else if ( typeof Opts.tag !== 'string' ){
			cb( false, new Error("Options.tag expected to be string, got " + typeof Opts.locale ) );
		} else if ( typeof Opts.type !== 'string' ){
			cb( false, new Error( "options.type expected to be string, got " + typeof Opts.type ) );
		} else {
			try{
				let uri = await this.render( this.Endpoints.getContentByTagAndType, { locale : Opts.locale, tag : Opts.tag, type : Opts.type } );
				let resp = await this._get( uri );
				cb( resp, false );
			}catch( e ){
				cb( false, e );
			}
		}
	}
	
	/**
	 * @param { Object } Options - The data required for this API call
	 *   @property { string } Options.locale - The local to search in
	 *   @property { string } Options.cType - Content type tag: Help, News, etc. Supply multiple ctypes separated by space
	 *   @property { string | number } Options.currentPage - Page number for the search results, starting with page 1.
	 *   @property { string } Options.searchText - Word or phrase for the search.
	 *   @property { string } Options.tag - Tag used on the content to be searched
	 *   @property { string= } Options.source - For analytics, hint at the part of the app that triggered the search.
	 * @param { function } callback - The function to be called once this API call completes
	 */
	async searchContentWithText( Opts, cb ){
		if( typeof Opts.locale !== 'string' ){
			cb( false, new Error("Options.locale expected to be string; got " + typeof Opts.locale ) );
		}else if(typeof Opts.cType !== 'string' ){
			cb( false, new Error( "Options.cType expected to be string; got " + typeof Opts.cType ) );
		} else if( ! parseInt( Opts.currentPage ) ){
			cb( false, new Error( "Options.currentPage expected to be number-like; got " + typeof Opts.number ) );
		} else if( typeof Opts.searchText !== 'string' ){
			cb( false, new Error( "Options.searchText expected to be string; got " + typeof Opts.searchText ) );
		} else if( typeof Opts.tag !== 'string' ){
			cb( false, new Error( "Options.tag expected to be string; got " + typeof Opts.tag ) );
		} else {
			try{
				let PathParams = { locale: Opts.locale };
				let QueryStrings = {
					currentpage: Opts.currentPage,
					ctype: Opts.cType,
					searchtext: Opts.searchText,
					tag: Opts.tag
				}
				
				let uri  = await this.render( this.Endpoints.searchContentWithText, PathParams, QueryStrings);
				let resp = await this._get( uri );
				cb( resp, false );
				
			}catch( e ){ cb( false, e ); };
		}
	}
	
	
	/**
	 * @param { Object } Options - An object containing all of the data required for this API call
	 *   @property { string } locale - The locale to search
	 *   @property { string } tag - The tag to search
	 *   @property { string } type - The type to search 
	 *   @property { number-like } currentPage - The page number for the search results starting with page 1
	 * @param { function } callback - The function to be called when the API call has finished
	 */
	async searchContentByTagAndType( Opts, cb ){
		if( typeof Opts.locale !== 'string' ){
			cb( false, new Error("Options.locale expected to be string; got " + typeof Opts.locale ) );
		} else if ( typeof Opts.tag !== 'string' ){
			cb( false, new Error("Options.tag expected to be string; got " + typeof Opts.tag) );
		} else if ( typeof Opts.type !== 'string' ){
			cb( false, new Error( 'Options.type expected to be string; got ' + typeof Opts.type ) );
		} else if ( !parseInt( Opts.currentPage ) ){
			cb( false, new Error( 'Options.currentPage expected to be number-like; got ' + typeof Opts.currentPage ) );
		} else {
			try{
				let PathParams = {
					locale: Opts.locale,
					tag : Opts.tag,
					type: Opts.type
				};
				
				let QueryStrings = {
					currentpage : Opts.currentPage
				}
				
				let uri = await this.render( this.Endpoints.searchContentByTagAndType, PathParams, QueryStrings);
				let resp = await this._get( uri );
			}catch( e ){ cb( false, e ); }
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