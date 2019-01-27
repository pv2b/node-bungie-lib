/** @module Destiny2 */
"use strict"
const Ml = require( __dirname + "/../MicroLibrary.js" );
const debug = require( 'debug' )( 'Destiny2' );
const Fs = require( 'fs' );
const Util = require( 'util' );
const Path = require( 'path' );
var Request = null;

class Destiny2{
	/**
	 * @param { ApiCreds } ApiCreds - Your API credentials
	 */
	constructor( ApiCreds ){
		this.ApiCreds  = ApiCreds;
		Request        = new Ml.Request( ApiCreds );
		this.Manifest  = {};
		this.userAgent = ApiCreds.userAgent
		this.manifestFiles = [];
	}
	
	/**
	 * Initializes the specified manifest(s)
	 * @param { Array.string } [languages=['en']] - The languages of manifest that you will need
	 * @returns { Promise }
	 */
	async init( langs = [ 'en' ] ){
		let readDir = Util.promisify( Fs.readdir );
		let proms = [];
		return readDir( __dirname + '/manifests').then( files => {
			this.manifestFiles = files;
			langs.forEach( lang => {
				if( files.indexOf( lang + '.json' ) !== -1 )
					proms.push( this.loadManifest( lang ) );
				else
					proms.push( this.downloadManifest( lang ).then( x => this.loadManifest( lang ) ) );
			} );
			
			return Promise.all( proms ).then( x => "Destiny2 initialized" );
		} );
	}
	
	/**
	 * loads the specified manifest(s) from disk
	 * @param { Array.string } [language=['all']] - The language of manifest to load
	 * @returns { Promise }
	 */
	async loadManifest( lang = 'en' ){
		var startPath = __dirname + '/manifests/';
		
		return Util.promisify( Fs.readdir )( startPath ).then( files => {
			this.manifestFiles = files;
			let readFile = Util.promisify( Fs.readFile );
			let proms = [];
			debug( 'looking for manifest ' + lang );
			files.forEach( file => {
				// Each manifest file is named lang.json. For instance the 'en' manifest JSON file is named en.json.
				if( lang === 'all' || file === lang + '.json' ){
					debug( 'found manifest "' + lang + '" Loading....' );
					proms.push( readFile( Path.join( startPath, file ) ).then( contents => {
						this.Manifest[ lang ] = JSON.parse( contents );
						debug( 'done!' );
						return this.Manifest[ lang ];
					} ) );
				}
			} );
			
			if( proms.length === 0 )
				return false;
			else
				return Promise.all( proms ).then( x => this.Manifest );
		} )
	}
	
	/**
	 * downloads the specified manifest and saves it to the disk as "./manifests/{language}.json"
	 * @param { Array.string } languages - The language of manifest to download
	 */
	async downloadManifest( lang = 'en' ){
		debug( 'downloading mainfiest ' + lang );
		let manifestContent = await this.getMeta().then( Meta => Request.get( this.Endpoints.rootPath + Meta.Response.jsonWorldContentPaths[ lang ], false ) );
		let path = __dirname + '/manifests/' + lang + '.json';
		debug( 'writing manifest to file...' )
		Fs.writeFile( path, JSON.stringify( manifestContent ), err => {
			if( err ) throw err;
			debug( 'done!' );
			return path;
		} )
	}
	
	async getMeta(){
		debug( 'getting meta data ' )
		return new Promise( ( resolve, reject ) => {
			
			if( this._Meta === null ){
				debug( 'meta data does not exist, fetching...' )
				resolve( Request.get( this.Endpoints.rootPath + this.Endpoints.getDestinyManifest ) ).then( Meta => {
					debug( 'done!' );
					this._Meta = Meta;
					return Meta;
				} );
			} else {
				debug( 'done!' );
				resolve( this._Meta );
			}
		} );
	}
	
	/**
	 * Untested : Returns the static definition of an entity of the given Type and hash identifier. Examine the API Documentation for the Type Names of entities that have their own definitions. Note that the return type will always *inherit from* DestinyDefinition, but the specific type returned will be the requested entity type if it can be found. Please don't use this as a chatty alternative to the Manifest database if you require large sets of data, but for simple and one-off accesses this should be handy.
	 * @param { string } entityType - The type of entity for whom you would like results. These correspond to the entity's definition contract name. For instance, if you are looking for items, this property should be 'DestinyInventoryItemDefinition'. PREVIEW: This endpoint is still in beta, and may experience rough edges. The schema is tentatively in final form, but there may be bugs that prevent desirable operation.
	 * @param { number-like } hashIdentifier - The hash identifier for the specific Entity you want returned.
	 * @returns { Promise }
	 */
	getDestinyEntityDefinition( entityType, hashIdentifier ){
		return Ml.rendernEndpoint( this.Endpoints.getDestinyEntityDefinition, { entityType, hashIdentifier } )
			.then( endpoint => Reqeuest.get( this.Endpoints.rootPath + endpoint ) );
	}
	 
	/**
	 * UNTESTED: Returns a list of Destiny memberships given a full Gamertag or PSN ID.
	 * @param { string } displayName - The full gamertag or PSN id of the player. Spaces and case are ignored.
	 * @param { module:Destiny2/Enum~bungieMembershipType } [membershipType="all"] - A valid non-BungieNet membership type, or All.
	 * @returns { Promise }
	 */
	searchPlayer( displayName, membershipType = 'ALL' ){
		return Ml.renderEndpoint( this.Endpoints.searchDestinyPlayer, { displayName, membershipType } )
			.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	  
	/**
	 * Untested : Returns a summary information about all profiles linked to the requesting membership type/membership ID that have valid Destiny information. The passed-in Membership Type/Membership ID may be a Bungie.Net membership or a Destiny membership. It only returns the minimal amount of data to begin making more substantive requests, but will hopefully serve as a useful alternative to UserServices for people who just care about Destiny data. Note that it will only return linked accounts whose linkages you are allowed to view.
	 * @param { number-like } membershipId - The ID of the membership whose linked Destiny accounts you want returned. Make sure your membership ID matches its Membership Type: don't pass us a PSN membership ID and the XBox membership type, it's not going to work!
	 * @param { module:Destiny2/Enum~bungieMembershipType } [membershipType="ALL"] - The type for the membership whose linked Destiny accounts you want returned.
	 * @returns { Promise }
	 */
	getLinkedProfiles( membershipId, membershipType = "ALL" ){
		return Ml.renderEndpoint( this.Endpoints.getLinkedProfiles, { membershipType, membershipId } )
			.then( endpoint => Request.get( this.Endpoints.rootPath  + endpoint ) );
	}
	   
    /**
	 * Untested : Returns Destiny Profile information for the supplied membership.
	 * @param { number-like } destinyMembershipId - Destiny membership ID
	 * @param { module:Destiny2/Enum~bungieMembershipType } membershipType - A valid non-BungieNet membership type.
	 */
    getProfile( destinyMembershipId, membershipType ){
	   return Ml.renderEndpoint( this.Endpoints.getProfile, { destinyMembershipId, membershiType } )
		.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
    }
	   
    /**
	 * Untested : Returns character information for the supplied character.
	 * @param { Object } Options - The data required to complete this API call
	 *   @param { number-like } Options.characterId - ID of the character.
	 *   @param { number-like } Options.destinymembershipId - Destiny membership ID.
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.mType - A valid non-BungieNet membership type.
	 *   @param { Array.module:Destiny2/Enum~destinyComponentType } Options.components - An array of components to return (as strings or numeric values). See the DestinyComponentType enum for valid components to request. You must request at least one component to receive results.
	 * @returns { Promise }
	 */
    getCharacter( Opts ){
		let proms = [ Ml.enumLookup( Opts.mType, this.Enums.bungieMembershipType ) ];
		// For each component, lookup
		Opts.components.forEach( c => {
			proms.push( Ml.enumLookup( c, this.Enums.destinyComponentType ) );
		} );
		
		return Promise.all( proms ).then( enums => {
			
			// Set the proper ENUM values
			Opts.mType = enums[0];
			for( let i = 1; i < enums.length; i++){
				Opts.components[ i - 1] = enums[ i ];
			}
			
			// Create CSV string
			Opts.components = Opts.components.join( ", " );
			
			return 	Ml.renderEndpoint( this.Endpoints.getCharacter, { 
				characterId           : Opts.characterId, 
				destinyMembershipType : Opts.mType,
				destinyMembershipId   : Opts.destinyMembershipId 
			}, { components : Opts.components } ).then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
		});
    }
	   
    /**
	 * Returns information on the weekly clan rewards and if the clan has earned them or not. Note that this will always report rewards as not redeemed.
	 * @param { number-like } groupId - A valid group id of clan.
	 * @returns { Promise }
	 */
	getClanWeeklyRewardState( gId ){
		return Ml.renderEndpoint( this.Endpoints.getClanWeeklyRewardState, { groupId : gId } )
			.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * UNTESTED : Retrieve the details of an instanced Destiny Item. An instanced Destiny item is one with an ItemInstanceId. Non-instanced items, such as materials, have no useful instance-specific details and thus are not queryable here.
	 * @param { Object } Options - The data required to complete this API call
	 *   @param { number-like } Options.destinyMembershipId - The membership ID of the destiny profile.
	 *   @param { number-like } Options.itemInstanceId - The Instance ID of the destiny item.
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.mType - A valid non-BungieNet membership type.
	 *   @param { Array.module:Destiny2/Enum~destinyComponentType } Options.components - An array of components to return (as strings or numeric values). See the DestinyComponentType enum for valid components to request. You must request at least one component to receive results.
	 * @returns { Promise }
	 */
	getItem( Opts ){
		let proms = [ Ml.enumLookup( Opts.mType, this.Enums.bungieMembershipType ) ];
		// For each component, lookup
		Opts.components.forEach( c => {
			proms.push( Ml.enumLookup( c, this.Enums.destinyComponentType ) );
		} );
		
		return Promise.all( proms ).then( enums => {
			
			// Set the proper ENUM values
			Opts.mType = enums[0];
			for( let i = 1; i < enums.length; i++){
				Opts.components[ i - 1] = enums[ i ];
			}
			
			// Create CSV string
			Opts.components = Opts.components.join( ", " );
			
			return 	Ml.renderEndpoint( this.Endpoints.getItem, { 
				characterId           : Opts.characterId, 
				destinyMembershipType : Opts.mType,
				itemInstanceId   : Opts.itemInstanceId 
			}, { components : Opts.components } ).then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
		});
	}
	
	/**
	 * UNTESTED : Get currently available vendors from the list of vendors that can possibly have rotating inventory. Note that this does not include things like preview vendors and vendors-as-kiosks, neither of whom have rotating/dynamic inventories. Use their definitions as-is for those.
	 * @param { Object } Options - The data required to complete this API call
	 *   @param { number-like } Options.destinyMembershipId - The membership ID of the destiny profile.
	 *   @param { number-like } Options.characterId - The Destiny Character ID of the character for whom we're getting vendor info.
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.mType - A valid non-BungieNet membership type.
	 *   @param { Array.module:Destiny2/Enum~destinyComponentType } Options.components - An array of components to return (as strings or numeric values). See the DestinyComponentType enum for valid components to request. You must request at least one component to receive results.
	 * @returns { Promise }
	 */
	getVendors( Opts ){
		let proms = [ Ml.enumLookup( Opts.mType, this.Enums.bungieMembershipType ) ];
		// For each component, lookup
		Opts.components.forEach( c => {
			proms.push( Ml.enumLookup( c, this.Enums.destinyComponentType ) );
		} );
		
		return Promise.all( proms ).then( enums => {
			
			// Set the proper ENUM values
			Opts.mType = enums[0];
			for( let i = 1; i < enums.length; i++){
				Opts.components[ i - 1] = enums[ i ];
			}
			
			// Create CSV string
			Opts.components = Opts.components.join( ", " );
			
			return 	Ml.renderEndpoint( this.Endpoints.getVendors, { 
				characterId           : Opts.characterId, 
				destinyMembershipType : Opts.mType,
				destinyMembershipId   : Opts.destinyMembershipId 
			}, { components : Opts.components } ).then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
		});
	}
	
	/**
	 * UNTESTED : Get the details of a specific Vendor.
	 * @param { Object } Options - The data required to complete this API call
	 *   @param { number-like } Options.destinyMembershipId - The membership ID of the destiny profile.
	 *   @param { number-like } Options.characterId - The Destiny Character ID of the character for whom we're getting vendor info.
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.mType - A valid non-BungieNet membership type.
	 *   @param { Array.module:Destiny2/Enum~destinyComponentType } Options.components - An array of components to return (as strings or numeric values). See the DestinyComponentType enum for valid components to request. You must request at least one component to receive results.
	 *   @param { number-like } Options.vendorHash - The Hash identifier of the Vendor to be returned.
	 * @returns { Promise }
	 */
	getVendor( Opts ){
		let proms = [ Ml.enumLookup( Opts.mType, this.Enums.bungieMembershipType ) ];
		// For each component, lookup
		Opts.components.forEach( c => {
			proms.push( Ml.enumLookup( c, this.Enums.destinyComponentType ) );
		} );
		
		return Promise.all( proms ).then( enums => {
			
			// Set the proper ENUM values
			Opts.mType = enums[0];
			for( let i = 1; i < enums.length; i++){
				Opts.components[ i - 1] = enums[ i ];
			}
			
			// Create CSV string
			Opts.components = Opts.components.join( ", " );
			
			return 	Ml.renderEndpoint( this.Endpoints.getVendors, { 
				characterId           : Opts.characterId, 
				destinyMembershipType : Opts.mType,
				destinyMembershipId   : Opts.destinyMembershipId,
				vendorHash            : Opts.vendorHash
			}, { components : Opts.components } ).then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
		});
	}
	
	/**
	 * UNTESTED : Get the details of a specific Vendor.
	 * @param { Object } Options - The data required to complete this API call
	 *   @param { number-like } Options.destinyMembershipId - The membership ID of the destiny profile.
	 *   @param { number-like } Options.characterId - The Destiny Character ID of the character for whom we're getting vendor info.
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.mType - A valid non-BungieNet membership type.
	 *   @param { Array.module:Destiny2/Enum~destinyComponentType } Options.components - An array of components to return (as strings or numeric values). See the DestinyComponentType enum for valid components to request. You must request at least one component to receive results.
	 *   @param { number-like } Options.nodeHash - The hash identifier of the Presentation Node for whom we should return collectible details. Details will only be returned for collectibles that are direct descendants of this node.
	 * @returns { Promise }
	 */
	getVendor( Opts ){
		let proms = [ Ml.enumLookup( Opts.mType, this.Enums.bungieMembershipType ) ];
		// For each component, lookup
		Opts.components.forEach( c => {
			proms.push( Ml.enumLookup( c, this.Enums.destinyComponentType ) );
		} );
		
		return Promise.all( proms ).then( enums => {
			
			// Set the proper ENUM values
			Opts.mType = enums[0];
			for( let i = 1; i < enums.length; i++){
				Opts.components[ i - 1] = enums[ i ];
			}
			
			// Create CSV string
			Opts.components = Opts.components.join( ", " );
			
			return 	Ml.renderEndpoint( this.Endpoints.getVendors, { 
				characterId                    : Opts.characterId, 
				destinyMembershipType          : Opts.mType,
				destinyMembershipId            : Opts.destinyMembershipId,
				collectiblePresentationNodeHash : Opts.nodeHash
			}, { components : Opts.components } ).then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
		});
	}
	
	
	/**
	 * Untested : Transfer an item to/from your vault. You must have a valid Destiny account. You must also pass BOTH a reference AND an instance ID if it's an instanced item. itshappening.gif
	 * @param { Object } Options - the data required to complete this API call
	 *   @param { number-like } Options.itemReferenceHash - 
	 *   @param { number-like } Options.stackSize - 
	 *   @param { number-like } Options.itemId - 
	 *   @param { number-like } Options.characterId - 
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.membershipType - 
	 *   @param { boolean } [transferToVault=false] - 
	 * @param { oAuth } oAuth - Your oAuth tokens
	 */
	transferItem( Opts, oAuth ){
		Opts.transferToVault = ( typeof Opts.transferToVault !== 'boolean') ? false : Opts.transferToVault;
		return Request.post( this.Endpoints.rootPath + this.Endpoints.transferItem,	Opts, oAuth );
	}
	
	/**
	 * Untested : Extract an item from the Postmaster, with whatever implications that may entail. You must have a valid Destiny account. You must also pass BOTH a reference AND an instance ID if it's an instanced item.
	 * @param { Object } Options - The data required to complete this API call
	 *   @param { number-like } Options.itemReferencehash - 
	 *   @param { number-like } Options.stackSize - 
	 *   @param { number-like } Options.itemId - 
	 *   @param { number-like } Options.characterId - 
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.membershipType - 
	 * @param { oAuth } oAuth - Your oAuth tokens
	 * @returns { Promise }
	 */
	pullFromPostmaster( Opts, oAuth ){
		 return Request.post( this.Endpoints.rootPath + this.Endpoints.pullFromPostmaster, Opts );
	}
	 
	/**
	 * Untested : Equip an item. You must have a valid Destiny Account, and either be in a social space, in orbit, or offline.
	 * @param { Object } Options - The data required to complete this API call
	 *   @param { number-like } Options.itemId - 
	 *   @param { number-like } Options.characterId - 
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.membershipType - 
	 * @param { oAuth } oAuth - your oAuth tokens
	 * @returns { Promise }
	 */
	equipItem( Opts, oAuth ){
		return Request.post( this.Endpoints.rootPath + this.Endpoints.equipItem, Opts );
	}
	
	/**
	 * Equip a list of items by itemInstanceIds. You must have a valid Destiny Account, and either be in a social space, in orbit, or offline. Any items not found on your character will be ignored.
	 * @param { Object } Options - The data required to complete this API call
	 *   @param { Array.number-like } Options.itemIds - 
	 *   @param { number-like } Options.characterId - 
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.membershipType - 
	 * @param { oAuth } oAuth - Your oAuth tokens
	 * @returns { Promise }
	 */
	equipItems( Opts, oAuth ){
		return Request.post( this.Endpoints.rootPath + this.Endponits.equipItems, Opts );
	}
	
	/**
	 * Set the Lock State for an instanced item. You must have a valid Destiny Account.
	 * @param { Object } Options - The data required to complete this API request 
	 *   @param { boolean } Options.state - Whether or not the item is locked
	 *   @param { number-like } Options.itemId - 
	 *   @param { number-like } Options.characterId - 
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.membershipType
	 * @param { oAuth } oAuth - Your oAuth tokens
	 * @returns { Promise }
	 */
	setItemLockState( Opts, oAuth ) {
		return Request.pot( this.Endpoints.rootPath + this.Endpoitns.setItmeLockState, Opts );
	}
	
	/**
	 * Gets the available post game carnage report for the activity ID.
	 * @param { number-like } activityId - The ID of the activity whose PGCR is requested.
	 * @returns { Promise }
	 */
	getPostGameCarnageReport( activityId ){
		return Ml.renderEndpoint( this.Endpoints.getPostGameCarnageReport, { activityId } )
			.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * Report a player that you met in an activity that was engaging in ToS-violating activities. Both you and the offending player must have played in the activityId passed in. Please use this judiciously and only when you have strong suspicions of violation, pretty please.
	 * @param { Object } Options - The Data required to complete this API request
	 *   @param { number-like } Options.activityId - The ID of the activity where you ran into the brigand that you're reporting.
	 *   @param { Array.number-like } Options.reasonCategoryHashes - So you've decided to report someone instead of cursing them and their descendants. Well, okay then. This is the category or categorie(s) of infractions for which you are reporting the user. These are hash identifiers that map to DestinyReportReasonCategoryDefinition entries.
	 *   @param { Array.number-like } Options.reasonHashes - If applicable, provide a more specific reason(s) within the general category of problems provided by the reasonHash. This is also an identifier for a reason. All reasonHashes provided must be children of at least one the reasonCategoryHashes provided.
	 *   @param { number-like } Options.offendingCharacterId - Within the PGCR provided when calling the Reporting endpoint, this should be the character ID of the user that you thought was violating terms of use. They must exist in the PGCR provided.
	 */
	async reportPlayer( Opts, oAuth ){
		/*Opts.reasonCategoryHashes.forEach( reason => {
			if( typeof this.Manifest.en.DestinyReportReasonCategoryDefinition[ reason ] === 'undefined')
		} );*/
	}
	
	/**
	 * Untested : Gets historical stats definitions.
	 */
	getHistoricalStatsDefinition(){
		return Request.get( this.Endpoints.rootPath + this.Endpoints.getHistoricalStatsDefinition );
	}
	/**
	 * Untested : Gets a page list of Destiny items.
	 * @param { string } searchTerm - The string to use when searching for Destiny entities.
	 * @param { string } type - The type of entity for whom you would like results. These correspond to the entity's definition contract name. For instance, if you are looking for items, this property should be 'DestinyInventoryItemDefinition'.
	 * @param { string } [page=0] - Page number to return, starting with 0.
	 * @returns { Promise }
	 */
	searchDestinyEntities( searchTerm, type, page = 0 ){
		return Ml.renderEndpoint( this.Endpoints.searchDestinyEntities, { searchTerm, type }, { page } )
			.then( endpoint => Request.get( this.rootPath + endpoint ) );
	}
	
	/**
	 * Untested : Gets historical stats for indicated character.
	 * @param { Object } Options - THe datat required to complete this API call
	 *   @param { number-like } Options.characterId - The id of the character to retrieve. You can omit this character ID or set it to 0 to get aggregate stats across all characters.
	 *   @param { number-like } Options.destinyMembershipId - The Destiny membershipId of the user to retrieve.
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.membershipType - A valid non-BungieNet membership type.
	 *   @param { date-time } Options.dayEnd - Last day to return when daily stats are requested. Use the format YYYY-MM-DD.
	 *   @param { date-time } Options.dayStart - First day to return when daily stats are requested. Use the format YYYY-MM-DD
	 *   @param { Array.module:Destiny2/Enum~destinyStatsGroupType } Options.groups - Group of stats to include, otherwise only general stats are returned. Comma separated list is allowed. Values: General, Weapons, Medals
	 *   @param { Array.module:Destiny2/Enum~destinyActivityModeType } Options.modes - Game modes to return. See the documentation for DestinyActivityModeType for valid values, and pass in string representation, comma delimited.
	 *   @param { module:Destiny2/Enum~periodType } periodType - Indicates a specific period type to return. Optional. May be: Daily, AllTime, or Activity
	 * @returns { Promise }
	 */
	getHistoricalStats( Opts ){
		let groups = [];
		let modes  = [];
		Opts.groups.forEach( group => { groups.push( Ml.enumLookup( group, this.Enums.destinyStatsGroupType ) ) } );
		Opts.modes.forEach( mode => { modes.push( Ml.enumLookup( mode, this.Enums.destinyActivityModeType ) ) } );
		
		return Promise.all( [
			// Will be used directly below, use your eyes
			Promise.all( groups ),
			Promise.all( modes ),
			Ml.enumLookup( Opts.periodType, this.Enums.periodType ),
			Ml.enumLookup( Opts.membershipType, this.Enums.membershipType )
			
		] ).then( promises => {
			// Mapped directly above, use your eyes
			Opts.groups         = promises[0].join( "," );// Arrays are CSV strings I guess?
			Opts.modes          = promises[1].join( "," );
			Opts.periodType     = promises[2];
			Opts.membershipType = promises[3];
			
			return Ml.renderEndpoint( this.Endpoints.getHistoricalStats, {
				characterId         : Opts.characterId,
				destinyMembershipId : Opts.destinyMembershipId,
				membershipType      : Opts.membershipType
			}, {
				dayend     : Opts.dayEnd,
				daystart   : Opts.dayStart,
				groups     : Opts.groups.join( "," ), 
				modes      : Opts.modes.join( "," ),
				periodType : Opts.periodType
			} );
			
		} ).then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * Gets aggregate historical stats organized around each character for a given account.
	 * @param { number-like } destinyMembershipid - The Destiny membershipId of the user to retrieve.
	 * @param { module:Destiny2/Enum~bungieMembershipType } mType - A valid non-BungieNet membership type.
	 * @param {Array.module:Destiny2/Enum~destinyStatsGroupType } groups - Groups of stats to include, otherwise only general stats are returned. Comma separated list is allowed. Values: General, Weapons, Medals.
	 */
	getHistoricalStatsForAccount( destinyMembershipId, mType, groups ){
		let proms = [
			Ml.enumLookup( mType, this.Enums.bungieMembershipType )
		];
		
		groups.forEach( group => { 
			proms.push( Ml.enumLookup( group, this.Enums.destinyStatsGroupType ) ) ;
		} );
		
		return Promise.all( proms ).then( enums => {
			
			// Use the string version of the Enum
			mType = enums[0];
			for( let i = 1; i < enums.length; i++ )
				groups[ i - 1 ] = enums[ i ];
			
			return Ml.renderEndpoint( this.Endpoints.getHistoricalStatsForAccount, {
				// Path params
				destinyMembershipId : destinyMembershipId,
				membershipType : mType
			}, {
				// Query Params
				groups : groups.join( "," )
			} );
		}).then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * Untested - Gets activity history stats for indicated character.
	 * @param { Object } Options - The data required to complete this API request
	 *   @param { number-like } Options.characterId - The id of the character to retrieve.
	 *   @param { number-like } Options.destinyMembershipId - The Destiny membershipId of the user to retrieve.
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.membershipType - A valid non-BungieNet membership type.
	 *   @param { number-like  } Options.count - Number of rows to return
	 *   @param { module:Destiny2/Enum~destinyActivityModeType } Options.mode - A filter for the activity mode to be returned. None returns all activities. See the documentation for DestinyActivityModeType for valid values, and pass in string representation.
	 *   @param { number-like } [Options.page=0] - Page number to return, starting with 0.
	 */
	getActivityHistory( Opts ){
		Opts.page = ( isNaN( parseInt( Opts.page ) ) ) ? 0 : Opts.page;
		return Ml.renderEndpoint( this.Endpoints.getActivityHistory, {
			// Path params
			characterId         : Opts.characterId,
			destinyMembershipId : Opts.detinyMembershipId, 
			membershipType      : Opts.membershipType
		}, {
			// Query params
			count : Opts.count,
			mode  : Opts.mode,
			page  : Opts.page
		} ).then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * Untested - Gets details about unique weapon usage, including all exotic weapons.
	 * @param { number-like } characterId - The id of the character to retrieve.
	 * @param { number-like } destinyMembershipId - The Destiny membershipId of the user to retrieve.
	 * @param { module:Destiny2/Enum~bungieMembershipType } membershipTye - A valid non-BungieNet membership type.
	 * @returns { Promise }
	 */
	getUniqueWeaponHistory( characterId, destinyMembershipId, memebershipType ){
		return Ml.renderEndpoint( this.Endpoints.getUniqueWeaponHistory, { characterId, destinymembershipId,membershipType } )
			.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * Untested - Gets all activities the character has participated in together with aggregate statistics for those activities.
	 * @param { number-like } characterId - The id of the character to retrieve.
	 * @param { number-like } destinyMembershipId - The Destiny membershipId of the user to retrieve.
	 * @param { module:Destiny2/Enum~bungieMembershipType } membershipTye - A valid non-BungieNet membership type.
	 * @returns { Promise }
	 */
	getDestinyAggregateActivityStats( characterId, destinyMembershipId, membershipType ){
		return Ml.renderEndpoint( this.Endpoints.getDestinyAggregateActivityStats, { characterId, destinymembershipId,membershipType } )
			.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * Gets custom localized content for the milestone of the given hash, if it exists.
	 * @param { number-like } milestoneHash 
	 * @returns { Promise }
	 */
	getPublicMilestoneContent( milestoneHash ){
		return Ml.renderEndpoint( this.Endpoints.getDestinyAggregateActivityStats, { milestoneHash } )
			.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
	
	/**
	 * Gets public information about currently available Milestones.
	 * @returns { Promise }
	 */
	getPublicMilestones(){
		return Request.get( this.Endpoints.rootPath + this.Endpoints.getPublicMilestones() );
	}
	
	/**
	 * Untested - Initialize a request to perform an advanced write action.
	 * @param { Object } Options - The data required to complete this API request
	 *   @param {module:Destiny2/Enum~awaType } Options.type - 
	 *   @param { module:Destiny2/Enum~bungieMembershipType } Options.membershipType - Destiny membership type of the account to modify.
	 *   @param { ?number-like } [Options.affectedItemId=null] - Item instance ID the action shall be applied to. This is optional for all but a new AwaType values. Rule of thumb is to provide the item instance ID if one is available.
	 *   @param { ?number-like } [Options.characterId=null] - Destiny character ID, if applicable, that will be affected by the action.
	 * @param { oAuth } oAuth - Your oAuth tokens
	 */
	awaitInitializeRequest( Opts, oAuth ){
		return Promise.all( [
			Ml.enumLookup( Opts.type, this.Enums.awaType),
			Ml.enumLookup( Opts.membershipType, this.Enums.bungieMembershipType )
		] ).then( enums => {
			Opts.type          = enums[ 0 ];
			Opts.membershipType = enums[ 1 ];
			return Request.post( this.Endpoitns.rootPath + this.Endpoints.awaitInitializeRequest, Opts, oAuth );
		});
	}
	
	/**
	 * @param { Object } Options - THe data required to complete this API request
	 *   @param { module:Destiny2/Enum~awaUserSelection } Options.selection - Indication of the selection the user has made (Approving or rejecting the action)
	 *   @param { string } Options.correlationId - Correlation ID of the request
	 *   @param { Array.byte } Options.nonce - Secret nonce received via the PUSH notification.
	 * @param { oAuth } oAuth - Your oAuth tokens 
	 * @returns { Promise }
	 */
	awaProvideAuthorizationResult( Opts, oAuth ){
		return Ml.enumLookup( Opts.selection, this.Enums.awaUserSelection )
			.then( sel => {
				Opts.selection = sel;
				return Request.post( this.Endpoints.rootPath + this.Endpoints.awaProvideAuthorizationResult, Opts, oAuth );
			})
	}
	
	/**
	 * Returns the action token if user approves the request.
	 * @param { string } correlationId - The identifier for the advanced write action request.
	 * @param { oAuth } oAuth - Your oAuth tokens
	 * @returns { Promise }
	 */
	awaGetActionToken( correlationId, oAuth ){
		return Ml.renderEndpoint( this.Endpoints.awaGetActionToken, { correlationId } )
			.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
	}
}

module.exports = Destiny2;