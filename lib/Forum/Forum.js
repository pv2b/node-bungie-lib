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
	 * @param { ApiCreds } ApiCreds - An Object containing your API credentials.
	 * @example
	 * let ApiCreds = {
	 *   key : "my_super_secret_api_key",
     *   clientId: "my_client_id",
     *   userAgent : "MyApp/0.2.3 AppId/MyAppId (+myProjectUrl;mycontact@email.com)"	 		 
	 * }
	 *
	 * let ForumLib = require( '/path/to/Forum.js' );
	 * const Forum = new ForumLib( ApiCreds );
	 */
	constructor( ApiCreds ){		
		this.ApiCreds   = ApiCreds;
		this.Endpoints = require( __dirname + '/endpoints.js');
		this.Enums     = require( __dirname + '/enums.js');
		this.userAgent = ApiCreds.userAgent;
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
		// First, make sure all enumerated values are valid
		try{
			Opts.categoryFilter = await MicroLib.enumLookup( Opts.categoryFilter, this.Enums.topicsCategoryFilters );
			Opts.quickDate = await MicroLib.enumLookup( Opts.quickDate, this.Enums.topicsQuickDate );
			Opts.sort = await MicroLib.enumLookup( Opts.sort, this.Enums.topicsSort );
		} catch(e){ cb( false, e ); }
		
		if(false){
		// Everything looks good, lets try to make the API call
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
			"X-API-KEY": this.ApiCreds.key,
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