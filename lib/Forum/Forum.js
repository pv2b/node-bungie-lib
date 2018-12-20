"use strict"
const Fs       = require( 'fs' );
const MicroLib = require( __dirname + '/../microLib/main.js');
const Https    = require( 'https' );

/**
 * 
 * @class
 */
class Forum{
	/**
	 * Wraps all Forum endpoints of the Bungie.net API
	 * @constructor
	 * @param { ApiAuth } ApiAuth - An Object containing your API credentials.
	 * @example
	 * let ApiAuth = {
	 *   key : "my_super_secret_api_key",
     *   clientId: "my_client_id",
     *   userAgent : "MyApp/0.2.3 AppId/MyAppId (+myProjectUrl;mycontact@email.com)"	 		 
	 * }
	 *
	 * let ForumLib = require( '/path/to/Forum.js' );
	 * const Forum = new ForumLib( ApiAuth );
	 */
	constructor( ApiAuth ){
		if( typeof ApiAuth.userAgent !== "string" )
			throw new Error( 'ApiAuth expected to be string, got ' + typeof ApiAuth.userAgent);
		if( typeof ApiAuth.key !== "string" )
			throw new Error( 'ApiAuth expected to be string, got ' + typeof ApiAuth.key);
		
		this.ApiAuth   = ApiAuth;
		this.Endpoints = JSON.parse ( Fs.readFileSync( __dirname + '/endpoints.json' ) );
		this.Enums     = require( __dirname + '/enums.js');
		this.userAgent = ApiAuth.userAgent;
	}
	
	
	/**
	 * @param { Object } Options - An object containing the data what we need to complete this API call
	 *   @property { string } Options.categoryFilter - Should be one of the names defined in {@link module:ForumEnum~topicsCategoryFilters}
	 *   @property { number } Options.group - The group, if any
	 *   @property { number } Options.page - Zero paged number
	 *   @property { string } Options.quickDate - Should be one of the names defined in {@link module:ForumEnum~topicsQuickDate}
	 *   @property { string } Options.sort - Should be one of the names defined in {@link module:ForumEnum~topicsSort}
	 *   @property { number= } [Options.pageSize=25] - currently unused
	 *   @property { string= } [Options.locales='en'] - Comma separated list of locales posts must match to return in the result list
	 *   @property { string= } [Options.tagString=''] - The tags to search, if any
	 * @param { apiCallback } callback - The callback that handles the response
	 */
	async getTopicsPaged( Opts, cb ){
		// Try to get all of the enumerated types to upper case
		try{ Opts.categoryFilter = Opts.categoryFilter.toUpperCase(); } catch(e){ cb ( false, new MicroLib.TypeError( { varName : "Options.categoryFilter", variable : Opts.categoryFilter, expected : 'string' } ) ); }
		try{ Opts.quickDate = Opts.quickDate.toUpperCase(); } catch(e){ cb ( false, new MicroLib.TypeError( { varName : "Options.quickDate", variable : Opts.quickDate, expected : 'string' } ) ); }
		try{ Opts.sort = Opts.sort.toUpperCase(); } catch(e){ cb ( false, new MicroLib.TypeError( { varName : "Options.sort", variable : Opts.sort, expected : 'string' } ) ); }
		
		if( typeof this.Enums.topicsCategoryFilters[Opts.categoryFilter] !== 'number' ){
			cb( false, new MicroLib.EnumError( { enumKey: Opts.categoryFilter, description : 'category filter' } ) );
		} else if ( typeof this.Enums.topicsQuickDate[Opts.quickDate] !== 'number'){
			cb( false, new MicroLib.EnumError({ enumKey: Opts.quickDate, description: "date filter" } ) );
		} else if( typeof this.Enums.topicsSort[Opts.sort] !== 'number'){
			cb( false, new MicroLib.EnumError( { enumKey: Opts.sort, description: "sort mode" } ) );
		} else if( isNaN( parseInt( Opts.group ) ) ){
			cb( false, new MicroLib.TypeError({ varName: "Options.group", variable: Opts.group, expected: "number-like" } ) );
		} else if( isNaN ( parseInt( Opts.page ) ) ){
			cb( false, new MicroLib.TypeError( { varName: "Options.page", variable: Opts.page, expected: "number-like" } ) );
		} else {
			// Even though page size isn't used in the API, it is used to render the endpoint. so make sure that we have one.
			Opts.pageSize = ( isNaN( parseInt( Opts.pageSize ) ) ) ? 25 : parseInt( Opts.pageSize );
			Opts.locales = ( typeof Opts.locales == 'string') ? Opts.locales : 'en';
			Opts.tagString = ( typeof Opts.tagString == 'string' ) ? Opts.tagString : '';
			
			try{
				let uri = await MicroLib.render( this.Endpoints.getTopicsPaged, {
						page : Opts.page,
						pageSize: Opts.pageSize,
						group : Opts.group,
						sort: Opts.sort,
						quickDate: Opts.quickDate,
						categoryFilter : Opts.categoryFilter
					},{
						locales : Opts.locales,
						tagstring: Opts.tagString
					} );
				let resp = await this._get( uri );
				cb( resp, false);
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
						reject( new MicroLib.ApiError( data ) );
					}
					
				} );
			} );
		} );
	}
}

module.exports = Forum;