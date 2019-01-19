/** @module GroupV2 */
"use strict"
const Ml = require( __dirname + "/../MicroLibrary.js" );
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
		this.Enums = require( __dirname + "/Enums.js" );
		this.Endpoints = require( __dirname + "/Endpoints.js" );
		Request = new Ml.Request( ApiCreds );
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
		return Ml.enumLookup( type, this.Enums.bungieMembershipType )
			.then( type => Ml.renderEndpoint( this.Endpoints.getUserClanInviteSetting, { mType } ) )
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
		return Ml.enumLookup( type, this.Enums.bungieMembershipType )
			.then( type => Ml.renderEndpoint( this.Endpoints.setUserClanInviteSetting, { mType, allowInvites } ) )
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
			Ml.enumLookup( createDateRange, this.Enums.groupDateRange ),
			Ml.enumLookup( groupType, this.Enums.groupType )
		];

		return Prormise.all( enums )
			.then( enums => Ml.renderEndpoint( this.Endpoints.getRecommendedGroups, { createDateRange : enums[0], groupType : enums[1] } ) )
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
			Ml.enumLookup( Opts.groupType, this.Enums.groupType ),
			Ml.enumLookup( Opts.creationDate, this.Enums.groupDateRange ),
			Ml.enumLookup( Opts.sortBy, this.Enums.groupSortBy ),
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
					Query.groupMemberCountFilter = await Ml.enumLookup( Opts.groupMemberCountFilter, this.Enums.groupMemberCountFilter );
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
		return Ml.renderEndpoint( this.Endpoints.getGroup, { groupId } )
			.then( endpoint =>  Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * Get information about a specific group with the given name and type.
	 * @param { string } groupName - Exact name of the group to find.
	 * @param { module:GroupV2/Enum~groupType } groupType - Type of group to find.
	 * @returns { Promise }
	 */
	getGroupByName( groupName, groupType ){
		return Ml.enumLookup( groupType, this.Enums.groupType )
			.then( groupType => Ml.renderEndpoint( this.Endpoints.getGroupByName, { groupType, groupName } ) )
			.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * Get information about a specific group with the given name and type. The POST version.
	 * @param { string } groupName - Exact name of the group to find.
	 * @param { module:GroupV2/Enum~groupType } groupType - Type of group to find.
	 * @returns { Promise }
	 */
	getGroupByNameV2( groupName, groupType ){
		return Ml.enumLookup( groupType, this.Enums.groupType )
			.then( groupType => Request.post( 
				this.Endpoints.rootPath + this.Endpoints.getGroupByNameV2, 
				{ groupName, groupType } 
			) );
	}
	
	/**
	 * Gets a list of available optional conversation channels and their settings.
	 * @param { number-like } groupId - Requested group's id
	 * @returns { Promise }
	 */
	getGroupOptionalConversations( groupId ){
		return Ml.renderEndpoint( this.Endpoints.getGroupOptionalConversations, { groupId } )
			.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/** 
	 * Create a new group.
	 * @param { Object } Options - The various options required by this API call
	 *   @param { module:GroupV2/Enum~groupType } Options.groupType - Type of group, either Bungie.net hosted group, or a game services hosted clan.
	 *   @param { string } Options.name - 
	 *   @param { string } Options.about - 
	 *   @param { string } Options.motto -
	 *   @param { string } Options.theme - 
	 *   @param { number-like } Options.avatarImageIndex - 
	 *   @param { string } Options.tags - 
	 *   @param { boolean } Options.isPublic - 
	 *   @param { module:GroupV2/Enum~membershipOption } Options.membershipOption - 
	 *   @param { boolean } Options.isPublicTopicAdminOnly - 
	 *   @param { boolean } Options.isDefaultPostPublic - 
	 *   @param { boolean } Options.allowChat - 
	 *   @param { boolean } Options.isDefaultPostAlliance - 
	 *   @param { module:GroupV2/Enum~chatSecuritySetting } Options.chatSecuritySetting -
	 *   @param { string } Options.callsign - 
	 *   @param { string } Options.locale -
	 *   @param { module:GroupV2/Enum~groupHomepage } Options.groupHomepage - 
	 *   @param { module:GroupV2/Enum~bungieMembershipType } Options.platformMembershipType - When operation needs a platform specific account ID for the present user, use this property. In particular, groupType of Clan requires this value to be set
	 * @param { oAuth } oAuth - Your oAuth tokens
	 */ 
	createGroup( Opts, oAuth ){
		debug( JSON.stringify( oAuth ) );
		let enums = [
			Ml.enumLookup( Opts.membershipOption, this.Enums.membershipOption ),
			Ml.enumLookup( Opts.chatSecuritySetting, this.Enums.chatSecuritySetting ),
			Ml.enumLookup( Opts.groupHomepage, this.Enums.groupHomepage ),
			Ml.enumLookup( Opts.platformMembershipType, this.Enums.bungieMembershipType ),
			Ml.enumLookup( Opts.groupType, this.Enums.groupType )
		];
		
		
		return  Promise.all( enums )
			.then( enums => {
				Opts.membershipOption = enums[0];
				Opts.chatSecuritySetting = enums[1];
				Opts.groupHomepage = enums[2];
				Opts.platformMembershipType = enums[3];
				Opts.groupType = enums[4];
				
				return Request.post( this.Endpoints.rootPath + this.Endpoints.createGroup, Opts, oAuth ) 
			});
	}
	
	/** 
	 * Edits a group.
	 * @param { Object } Options - The various options required by this API call
	 *   @param { string } Options.name - 
	 *   @param { string } Options.about - 
	 *   @param { string } Options.motto -
	 *   @param { string } Options.theme - 
	 *   @param { string } Options.tags - 
	 *   @param { boolean } Options.isDefaultPostAlliance - 
	 *   @param { boolean } Options.isDefaultPostPublic - 
	 *   @param { string } Options.callsign - 
	 *   @param { string } Options.locale -
	 *   @param { ?number-like } [Options.avatarImageIndex=null] - 
	 *   @param { ?module:GroupV2/Enum~groupType } [Options.groupType=null] - Type of group, either Bungie.net hosted group, or a game services hosted clan.
	 *   @param { ?boolean } [Options.isPublic=null] - 
	 *   @param { ?module:GroupV2/Enum~membershipOption } [Options.membershipOption=null] - 
	 *   @param { ?boolean } [Options.isPublicTopicAdminOnly=null] - 
	 *   @param { ?boolean } [Options.allowChat=null] - 
	 *   @param { ?module:GroupV2/Enum~chatSecuritySetting } [Options.chatSecuritySetting=null] -
	 *   @param { ?module:GroupV2/Enum~groupHomepage } [Options.groupHomepage=null] - 
	 *   @param { ?boolean } [Options.enableInvitationMessagingForAdmins=null] - 
	 *   @param { ?module:GroupV2/Enum~publicity} [Options.defaultPublicity=null] -
	 * @param { oAuth } oAuth - Your oAuth tokens
	 */ 
	editGroup( Opts, oAuth ){
		debug( JSON.stringify( oAuth ) );
		// These will either resolve with the correct enumeration string, or return null.( all fields are nullable )
		let enums = [
			Ml.enumLookup( Opts.membershipOption, this.Enums.membershipOption ).catch( e => null ),
			Ml.enumLookup( Opts.chatSecuritySetting, this.Enums.chatSecuritySetting ).catch( e => null ),
			Ml.enumLookup( Opts.groupHomepage, this.Enums.groupHomepage ).catch( e => null ),
			Ml.enumLookup( Opts.platformMembershipType, this.Enums.bungieMembershipType ).catch( e => null ),
			Ml.enumLookup( Opts.groupType, this.Enums.groupType ).catch( e => null )
		];
		
		
		
		// Null any nullable fields that weren't supplied
		Opts.avatarImageIndex = this.nullable( Opts.avatarImageIndex );
		Opts.isPublic = this.nullable( Opts.isPublic )
		Opts.isPublicTopicAdminOnly = this.nullable( Opts.isPublicTopicAdminOnly );
		Opts.allowChat = this.nullable( Opts.allowChat );
		Opts.enableInvitationMessagingForAdmins = this.nullable( Opts.enableInvitationMessagingForAdmins );
		
		return  Promise.all( enums )
			.then( enums => {
				Opts.membershipOption = enums[0];
				Opts.chatSecuritySetting = enums[1];
				Opts.groupHomepage = enums[2];
				Opts.platformMembershipType = enums[3];
				Opts.groupType = enums[4];
				debug( JSON.stringify(oAuth));
				return Request.post( this.Endpoints.rootPath + this.Endpoints.createGroup, Opts, oAuth ) 
			});
	}
	
	/**
	 * Edit an existing group's clan banner. You must have suitable permissions in the group to perform this operation. All fields are required.
	 * @param { Object } Options - The data required to complete this API call
	 *   @param { number-like } Options.groupId - Group ID of the group to edit
	 *   @param { number-like } Options.decalId - 
	 *   @param { number-like } Options.decalColorId - 
	 *   @param { number-like } Options.decalBackgroundColorId - 
	 *   @param { number-like } Options.gonfalonId - 
	 *   @param { number-like } Options.gonfalonColorId - 
	 *   @param { number-like } Options.gonfalonDetailId - 
	 *   @param { number-like } Options.gonfalonDetailColorId - 
	 * @param { oAuth } oAuth - Your oAuth tokens
	 * @returns { Promise }
	 */
	editClanBanner( Opts, oAuth ){
		return Ml.renderEndpoint( this.Endpoints.editClanBanner, { groupId : Opts.groupId } )
			.then( endpoint => Request.post( this.Endpoints.rootPath + endpoint, {
				decalId                : Opts.decalId,
				decalColorId           : Opts.decalColorId,
				decalBackgroundColorId : Opts.decalBackgroundColorId,
				gonfalonId             : Opts.gonfalonId,
				gonfalonColorId        : Opts.gonfalonColorId,
				gonfalonDetailId       : Opts.gonfalonDetailId,
				gonfalonDetailColorId  : Opts.gonfalonDetailColorId
			}, oAuth ) );
	}
	
	/**
	 * Edit group options only available to a founder. You must have suitable permissions in the group to perform this operation.
	 * @param { Object } Options - The data required to complete whit API call
	 *   @param { number-like } Options.groupId - Group ID of the group to edit
	 *   @param { ?boolean } [Options.invitePermissionOverride=null] - Minimum Member Level allowed to invite new members to group
	 *   @param { ?boolean } [Options.updateculturePermissionOverride=null] - Minimum Member Level allowed to update group culture
	 *   @param { ?module:GroupV2/Enum~hostGuidedGamePermissionOverride } [Options.hostGuidedGamePermissionOverride=null] - Minimum Member Level allowed to host guided games
	 *   @param { ?boolean } [Options.updateBannerPermissionOverride=null] - Minimum Member Level allowed to update banner
	 *   @param { ?module:GroupV2/Enum~groupMemberLevel } [Options.joinLevel=null] - Level to join a member at when accepting an invite, application, or joining an open clan
	 * @param { oAuth } oAuth - Your oAuth tokens
	 * @returns { Promise }
	 */
	editFounderOptions ( Opts, oAuth ){
		// Lookup enums and set to NULL on failure. Also render the endpoint while we are at it. 
		let enums = [
			Ml.enumLookup( Opts.hostGuidedGamePermissionOverride, this.Enums.hostGuidedGamePermissionOverride ).catch( e => null ),
			Ml.enumLookup( Opts.joinLevel, this.Enums.groupMemberLevel ).catch( e => null),
			Ml.renderEndpoint( this.Endpoints.editFounderOptions, { groupId : Opts.groupId } ).catch( e => null )
		];
		
		return Promise.all( enums ).then( enums => {
			Opts.hostGuidedGamePermissionOverride = enums[0];
			Opts.joinLevel = enums[1];
			return Request.post( enums[2], {
				JoinLevel                        : Opts.joinLevel ,
				HostGuidedGamePermissionOverride : Opts.hostGuidedGamePermissionOverride,
				InvitePermissionOverride         : Ml.nullable( Opts.invitePermissionOverride ),
				UpdateBannerPermissionOverride   : Ml.nullable( Opts.updateBannerPermissionOverride ),
				UpdateCulturePermissionOverride  : Ml.nullable( Opts.updateCulturePermissionOverride )
			}, oAuth );
		} );
	}
	
	/**
	 * Add a new optional conversation/chat channel. Requires Admin permissions to the group.
	 * @param { Object } Options - The data required to complete whit API call
	 *   @param { number-like } Options.groupId - Group ID of the group to edit.
	 *   @param { string } Options.chatName - 
	 *   @param { module:GroupV2/Enum~chatSecuritySetting } Options.chatSecurity - 
	 */
	async addOptionalConversation( Opts, oAuth ){
		// Lookup the ENUM and use "undefined" as the default value
		Opts.chatSecurity = await Ml.enumLookup( Opts.chatSecurity, this.Enums.chatSecuritySetting ).catch( e => "undefined" );		
		return ML.renderEndpoint( Opts.groupId, this.Endpoints.addOptionalConversation )
			.then( endpoint => Request.post( this.Endpoints.rootPath + endpoint, {
				chatName     : Opts.chatName,
				chatSecurity : Opts.chatSecurity
			}, oAuth ) );
	}
	
	/**
	 * Add a new optional conversation/chat channel. Requires Admin permissions to the group.
	 * @param { Object } Options - The data required to complete whit API call
	 *   @param { number-like } Options.groupId - Group ID of the group to edit.
	 *   @param { number-like } Options.conversationId - Conversation Id of the channel being edited.
	 *   @param { string } Options.chatName - 
	 *   @param { ?module:GroupV2/Enum~chatSecuritySetting } [Options.chatSecurity=null] - 
	 *   @param { ?boolean } [Options.chatEnabled=null] - 
	 * @returns { Promise }
	 */
	async editOptionalConversation( Opts, oAuth ){
		// Lookup the ENUM and use "undefined" as the default value
		Opts.chatSecurity = await Ml.enumLookup( Opts.chatSecurity, this.Enums.chatSecuritySetting ).catch( e => null );
		return Ml.renderEndpoint( this.Endpoints.editOptionalConversation, { conversationId: Opts.conversationId, groupId: Opts.groupId } )
			.then( endpoint => Request.post( this.Endpoints.rootPath + endpoint, {
				chatEnabled  : Ml.nullable( Opts.chatEnabled ),
				chatName     : Opts.chatName,
				chatSecurity : Opts.chatSecurity
			}, oAuth ) );
	}
	
	/**
	 * Get the list of members in a given group.
	 * @param { Object } Options - The data required to complete this APi call
	 *   @param { number-like } [Options.currentPage=1] - Page number (starting with 1). Each page has a fixed size of 50 items per page.
	 *   @param { number-like } Options.groupId - The ID og the group
	 *   @param { module:GroupV2/Enum~runtimeGroupMemberType } [Options.memberType="NONE"] - 
	 *   @param { string } [Options.nameSearch=""] - 
	 * @returns { Promise }
	 */
	async getMembersOfGroup( Opts ){
		// Loookup the Enum
		Opts.memberType = await Ml.enumLookup( Opts.memberType, this.Enums.runtimeGroupMemberType ).catch( e => 'NONE' );
		// Set default value of nameSearch
		Opts.nameSearch = ( typeof Opts.nameSearch === 'string' ) ? Opts.nameSearch : "";
		// Default page is 1
		Opts.currentPage = ( isNaN( parseInt( Opts.currentPage ) ) ) ? 1 : Opts.currentPage;
		return Ml.renderEndpoint(
			this.Endpoints.getMembersOfGroup,                             // Endpoint
			{ currentpage : Opts.currentPage, groupId : Opts.groupId },   // Path Parameters
			{ memberType : Opts.memberType, nameSearch: Opts.nameSearch } // QueryString parameters
		).then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) ); // GET request
	}
};

module.exports = GroupV2;
