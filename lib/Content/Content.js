"use strict"
const Fs       = require( 'fs' );
const Https    = require( 'https' );
const MicroLib = require( __dirname + '/../microLib/main.js');

/**
 
 * @class
 */
class Content{
	/**
	 * Wraps the Content endpoints of the Bungie.net API
	 * @constructor
	 * @param { ApiAuth } ApiAuth - An object containing your API credentials
	 * @example
	 * let ApiAuth = {
	 *   key : "my_super_secret_api_key",
     *   clientId: "my_client_id",
     *   userAgent : "MyApp/0.2.3 AppId/MyAppId (+myProjectUrl;mycontact@email.com)"
	 * }
	 *
	 * let ContentLib = require( '/path/to/Content.js' );
	 * const Content = new ContentLib( ApiAuth );
	 */
	constructor( ApiAuth ){		
		this.ApiAuth   = ApiAuth;
		this.Endpoints = JSON.parse( Fs.readFileSync( __dirname + '/endpoints.json'))
		this.userAgent = ApiAuth.userAgent;
	}
	
	/**
	 * @param { Object } Options - The data required for this API call
	 *   @property { string } Options.type - The type of content
	 * @param { apiCallback } callback - The function to be called once this API call has completed
	 * @see {@link https://bungie-net.github.io/multi/operation_get_Content-GetContentType.html#operation_get_Content-GetContentType | Content.getContentType} for more information
	 * @example
	 * Content.getContentType( { type : "some_content_type" }, ( Response, err ) => {
	 *     if( err !== false ) {
	 *         // Error handling
	 *     } else {
	 *         console.log( Response ); // Do something with the response
	 *     }
	 * } );
	 */
	async getContentType( Opts, cb ){
		
		if( typeof Opts.type !== 'string' ){
			cb( false, new Error( "Options.type expected to be string, got " + typeof Opts.type ) );
		} else {
			// Try to generate a valid response
			try{
				let uri = await MicroLib.render( this.Endpoints.getContentType, { type: Opts.type } );
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
	 * @param { apiCallback } callback - The function to be called once this API call has completed
	 * @see {@link https://bungie-net.github.io/multi/operation_get_Content-GetContentById.html#operation_get_Content-GetContentById | Content.getContentById} for more information
	 * @example
	 * Content.getContentById( { id : 'some_id', locale: 'some_locale' }, ( Response, err ) => {
	 *     if( err !== 'false' ) {
	 *         //Error handling 
	 *     } else {
	 *         console.log( Response ); // Do something with the API response
	 *     }
	 * });
	 */
	async getContentById( Opts, cb ){
		if( !parseInt( Opts.id ) ){
			cb(false, new Error( "Options.id expected to be number-like, got " + typeof Opts.id ) );
		}else if( typeof Opts.locale !== 'string' ){
			cb( false, new Error( "Options.locale expected to be string, got " + typeof Opts.locale ) );
		} else {
			try{
				let uri = await MicroLib.render( this.Endpoints.getContentById, { id: Opts.id, locale: Opts.locale } );
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
	 * @param { apiCallback } callback - The function to be called once this API call completes
	 * @see {@link https://bungie-net.github.io/multi/operation_get_Content-GetContentByTagAndType.html#operation_get_Content-GetContentByTagAndType | Content.getContentByTagAndType} for more information
	 * @example
	 * Content.getContentByTagAndType( { locale: 'some_locale', tag: 'some_tag', type: 'some_type' }, ( Response, err ) => {
	 *     if( err !== false ) {
	 *         // Error handling
	 *     } else {
	 *         console.log( Response ); // Do something with the API response
	 *     }
	 * } );
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
				let uri = await MicroLib.render( this.Endpoints.getContentByTagAndType, { locale : Opts.locale, tag : Opts.tag, type : Opts.type } );
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
	 * @param { apiCallback } callback - The function to be called once this API call completes
	 * @see {@link https://bungie-net.github.io/multi/operation_get_Content-SearchContentWithText.html#operation_get_Content-SearchContentWithText | Content.searchContentWithText} for more information
	 * @example
	 * let Opts = {
	 *     locale      : 'some_locale',
     *     cType       : 'some_content_type',
	 *     currentPage : 1,
	 *     searchText  : 'your_search_term',
	 *     tag         : 'some_tag'
	 * };
	 *
	 * Content.searchContentWithText( Opts , ( Response, err ) => {
	 *     if( err !== false ) {
	 *         // Error handling
	 *     } else {
     *         console.log( Response ); // Do something with the API response
	 *     }
	 * } );
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
				
				let uri  = await MicroLib.render( this.Endpoints.searchContentWithText, PathParams, QueryStrings);
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
	 * @param { apiCallback } callback - The function to be called when the API call has finished
	 * @see {@link https://bungie-net.github.io/multi/operation_get_Content-SearchContentByTagAndType.html#operation_get_Content-SearchContentByTagAndType | Content.searchContentByTagAndType} for more information
	 * @example
	 * let Opts = {
	 *     locale : 'some_locale',
	 *     tag: 'some_tag',
	 *     type: 'some_type',
	 *     currentPage : 1
	 * }
	 *
	 * Content.searchContentByTagAndType( Opts, ( Response, err ) => {
	 *     if( err !== false ){
     *         // Error handling
	 *     } else {
	 *         console.log( Response ); // Do something with the API response
	 *     }
	 * } );
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
				
				let uri = await MicroLib.render( this.Endpoints.searchContentByTagAndType, PathParams, QueryStrings);
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