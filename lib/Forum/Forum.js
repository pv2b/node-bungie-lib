"use strict"
const Fs       = require( 'fs' );
const MicroLib = require( __dirname + '/../microLib/main.js');
const Https    = require( 'https' );

/**
 * @module Forum
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
		/** Object containing all of the Endpoints for this wrapper */
		this.Endpoints = require( __dirname + '/endpoints.js');
		/**
		 * Object containing all of the enumerations for this wrapper
		 * @see module:Forum/Enum
		 */
		this.Enums     = require( __dirname + '/enums.js');
		this.userAgent = ApiCreds.userAgent;
	}
	
	
	/**
	 * @param { Object } Options - An object containing the data what we need to complete this API call
	 *   @param { string } Options.categoryFilter - Should be one of the names defined in {@link module:ForumEnum~topicsCategoryFilters}
	 *   @param { number } Options.group - The group, if any
	 *   @param { number } Options.page - Zero paged number
	 *   @param { string } Options.quickDate - Should be one of the names defined in {@link module:ForumEnum~topicsQuickDate}
	 *   @param { string } Options.sort - Should be one of the names defined in {@link module:ForumEnum~topicsSort}
	 *   @param { number= } [Options.pageSize=25] - currently unused
	 *   @param { string= } [Options.locales='en'] - Comma separated list of locales posts must match to return in the result list
	 *   @param { string= } [Options.tagString=''] - The tags to search, if any
	 * @param { apiCallback } callback - The callback that handles the response
	 */
	async getTopicsPaged( Opts, cb ){
		
		let enumLookups = [
			MicroLib.enumLookup( Opts.categoryFilter, this.Enums.topicsCategoryFilters ),
			MicroLib.enumLookup( Opts.quickDate, this.Enums.topicsQuickDate ),
			MicroLib.enumLookup( Opts.sort, this.Enums.topicsSort )
		]
		
		let pathParams = {
			page : Opts.page,
			pageSize: Opts.pageSize,
			group : Opts.group,
			sort: Opts.sort,
			quickDate: Opts.quickDate,
			categoryFilter : Opts.categoryFilter
		};
		
		let queryStrings = {
			locales : Opts.locales,
			tagstring: Opts.tagString
		}
		
		// Even though page size isn't used in the API, it is used to renderEndpoint the endpoint. so make sure that we have one.
		Opts.pageSize  = ( isNaN( parseInt( Opts.pageSize ) ) ) ? 25 : parseInt( Opts.pageSize );
		Opts.locales   = ( typeof Opts.locales == 'string') ? Opts.locales : 'en';
		Opts.tagString = ( typeof Opts.tagString == 'string' ) ? Opts.tagString : '';
		
		return Promise.all( enumLookups )
		  .then( () => MicroLib.renderEndpoint( this.Endpoints.getTopicsPaged, pathParams, queryStrings ) )
		  .then( uri => this._get( uri ) );
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