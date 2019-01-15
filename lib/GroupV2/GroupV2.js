/** @module GroupV2 */
"use strict"
const MicroLib = require( __dirname + "/../microLib/main.js" );
const QueryString = require( 'querystring' );
const debug = require( 'debug' )( "GroupV2" );
var Request = null;

class GroupV2 {
	/**
	 * Wraps all of the GroupV2 Bungie.net endpoints
	 * @constructor
	 * @param { ApiCreds } ApiCreds - Your API credentials
	 */
	constructor( ApiCreds ){
		this.ApiCreds = ApiCreds
		this.Enums = require( __dirname + "/enums.js" );
		this.Endpoints = require( __dirname + "/endpoints.js" );
		Request = new MicroLib.Request( ApiCreds );
	}

	/**
	 * Returns a list of all available group avatars for the signed-in user.
	 * @returns { Promise }
	 */
	async getAvailableAvatars(){
		return Request.get( this.Endpoints.rootPath + this.Endpoints.getAvailableAvatars );
	}

	/**
	 * Returns a list of all available group themes.
	 * @returns { Promise }
	 */
	async getAvailableThemes(){
		return Request.get( this.Endpoints.rootPath + this.Endpoints.getAvailableThemes );
	}

	/**
	 * Gets the state of the user's clan invite preferences for a particular membership type - true if they wish to be invited to clans, false otherwise.
	 * @param { BungieMembershipType } type - TheDestiny membership type of the account we wish to access settings
	 * @param { oAuth } oAuth - Your oAuth object.  {@link module:OAuth~OAuth See} for more information
	 * @returns { Promise }
	 */
	async getUserClanInviteSettings( mType, oAuth){
		return MicroLib.enumLookup( type, this.Enums.bungieMembershipType )
			.then( type => MicroLib.renderEndpoint( this.Endpoints.getUserClanInviteSetting, { mType } ) )
		.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint , oAuth ) );
	}

	/**
	 * Sets the state of the user's clan invite preferences - true if they wish to be invited to clans, false otherwise.
	 * @param { boolean } allowInvites - True to allow invites of this user to clans, false otherwise.
	 * @param { BungieMembershipType } mType - The Destiny membership ype of linked account we are manipulating
	 * @param { oAuth } oAuth - You oAUth credentials
	 * @returns { Promise }
	 */
	async setUserClanInviteSetting( allowInvites, mtTpe, oAuth ){
		return MicroLib.enumLookup( type, this.Enums.bungieMembershipType )
			.then( type => MicroLib.renderEndpoint( this.Endpoints.setUserClanInviteSetting, { mType, allowInvites } ) )
		.then( endpoint => Request.post( this.Endpoints.rootPath + endpoint , "" , oAuth ) );
	}

	/**
	 * Gets groups recommended for you based on the groups to whom those you follow belong.
	 * @param { groupDateRange } createDateRange - Requested range in which to pull recommended groups
	 * @param { groupType } groupType - The type of groups requested
	 * @param { oAuth } oAuth - Your oAuth credentials
	 * @returns { Promise }
	 */
	async getRecommendedGroups( createDateRange, groupType, oAuth ){
		let enums = [
			MicroLib.enumLookup( createDateRange, this.Enums.groupDateRange ),
			MicroLib.enumLookup( groupType, this.Enums.groupType )
		];

		return Prormise.all( enums )
			.then( enums => MicroLib.renderEndpoint( this.Endpoints.getRecommendedGroups, { createDateRange : enums[0], groupType : enums[1] } ) )
			.then( endpoint => Request.post( this.Endpoints.rootPath + endpoint, "", oAuth ) );
	}
	
	/**
	 * Search for Groups
	 * @param { Object } Options - The options required to complete this API request
	 *   @param { string } Options.name  - The name of the group
	 *   @param { module:GroupV2/Enum~groupType } Options.groupType - The type of group to search for
	 *   @param { module:GroupV2/Enum~groupDateRange } Options.creationDate - The date range of the group
	 *   @param { module:GroupV2/Enum~groupSortBy } Options.sortBy - How to sort the results
	 *   @param { string } Options.requestContinuationToken - UNDOCUMENTED AND UNINTUITIVE. NO IDEA WTF THIS IS.
	 *   @param { number-like } [Options.itemsPerPage=25] Options.itemsPerPage - The number of items to return per page
	 *   @param { number-like } [Options.currentPage=0] Options.currentPage - The page you want to pull
	 *   @param { module:GroupV2/Enum~groupMemberCountFilter } [Options.groupMemberCountFilter=null] - Filter results by how many members the group hasAttribute
	 *   @param { string } [Options.localeFilter=null] - The locale to search withing.
	 *   @param { string } [Options.tagText=null]
	 */
	async groupSearch( Opts ){
		/**
		 * NOTE: GroupQuery, as of Destiny 2, has essentially two totally different and incompatible "modes".
         * If you are querying for a group, you can pass any of the properties below.
		 * If you are querying for a Clan, you MUST NOT pass any of the following properties (they must be null or undefined in your request, not just empty string/default values):
		 *
		 * - groupMemberCountFilter - localeFilter - tagText
		 *
		 * If you pass these, you will get a useless InvalidParameters error.
		 */
		 
		Opts.itemsPerPage = ( isNaN( parseInt( Opts.itemsPerPage ) ) ) ? 25 : Opts.itemsPerPage;
		Opts.currentPage  = ( isNaN( parseInt( Opts.currentPage  ) ) ) ? 0  : Opts.currentPage;
		 
		let enums = [
			MicroLib.enumLookup( Opts.groupType, this.Enums.groupType ),
			MicroLib.enumLookup( Opts.creationDate, this.Enums.groupDateRange ),
			MicroLib.enumLookup( Opts.sortBy, this.Enums.groupSortBy ),
		];
		
		let Query = {
			name : Opts.name,
			itemsPerPage : Opts.itemsPerPage,
			currentPage : Opts.currentPage,
			//requestContinuationToken : Opts.requestContinuationToken
		};
		
		return Promise.all( enums ).then(async enums =>  {
			Query.groupType = enums[0];
			Query.creationDate = enums[1];
			Query.sortBy = enums[2];
			
			// If it's not a clan, set up the three oddball variables
			if( enums[0] !== 'CLAN' ){
				if( typeof Opts.tagText === 'string' ) Query.tagText = Opts.tagText;
				if( typeof Opts.localFilter === 'string') Query.localFilter = Opts.localFilter;
				try{
					Query.groupMemberCountFilter = await MicroLib.enumLookup( Opts.groupMemberCountFilter, this.Enums.groupMemberCountFilter );
				} catch {/* Intentionally do nothing */}
			// If it is a clan, set the three oddball variables to null
			} else {
				Query.tagText = null;
				Query.groupMemberCountFilter = null;
				Query.localeFilter = null;
			}
			
			debug( "Query is " + JSON.stringify( Query ) );
			
			// The Query has been built, make the request
			return Request.post( this.Endpoints.rootPath + this.Endpoints.groupSearch, Query );
		} );
	}
	
	/**
	 * Get information about a specific group of the given ID.
	 * @param { number-like } groupId - Requested group's id.
	 * @returns { Promise }
	 */
	getGroup( groupId ){
		return MicroLib.renderEndpoint( this.Endpoints.getGroup, { groupId } )
			.then( endpoint =>  Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * Get information about a specific group with the given name and type.
	 * @param { string } groupName - Exact name of the group to find.
	 * @param { module:GroupV2/Enum~groupType } groupType - Type of group to find.
	 * @returns { Promise }
	 */
	getGroupByName( groupName, groupType ){
		return MicroLib.enumLookup( groupType, this.Enums.groupType )
			.then( groupType => MicroLib.renderEndpoint( this.Endpoints.getGroupByName, { groupType, groupName } ) )
			.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * Get information about a specific group with the given name and type. The POST version.
	 * @param { string } groupName - Exact name of the group to find.
	 * @param { module:GroupV2/Enum~groupType } groupType - Type of group to find.
	 * @returns { Promise }
	 */
	getGroupByNameV2( groupName, groupType ){
		return MicroLib.enumLookup( groupType, this.Enums.groupType )
			.then( groupType => Request.post( 
				this.Endpoints.rootPath + this.Endpoints.getGroupByNameV2, 
				{ groupName, groupType } 
			) );
	}
};

module.exports = GroupV2;
