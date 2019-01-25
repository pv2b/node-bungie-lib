/** @module Destiny2 */
"use strict"
const Ml = require( __dirname + "/../MicroLibrary.js" );
const debug = require( 'debug' )( 'Destiny2' );
const Fs = require( 'fs' );
const Util = require( 'util' );
const Path = require( 'path' );
var Manifest = null;
var Request = null;

class Destiny2{
	/**
	 * @param { ApiCreds } ApiCreds - Your API credentials
	 */
	constructor( ApiCreds ){
		this.ApiCreds  = ApiCreds;
		Manifest       = new  ( require( __dirname + '/Manifest.js' ) )( ApiCreds );
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
			debug( 'loading manifest ' + lang );
			files.forEach( file => {
				// Each manifest file is named lang.json. For instance the 'en' manifest JSON file is named en.json.
				if( lang === 'all' || file === lang + '.json' ){
					debug( 'found it! Loading....' );
					proms.push( readFile( Path.join( startPath, file ) ).then( contents => {
						this.Manifest[ lang ] = contents;
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
		*   @param { Array.module:Destiny2/Enum~destinyComponentType } Options.components - A comma separated list of components to return (as strings or numeric values). See the DestinyComponentType enum for valid components to request. You must request at least one component to receive results.
		* @returns { Promise }
		*/
	   getCharacter( Opts ){
		    let proms = [ Ml.enumLookup( Opts.mType, this.Enums.bungieMembershipType ) ];
			// For each component, lookup
			Opts.components.forEach( c => {
				poms.push( Ml.enumLookup( c, this.Enums.destinyComponentType ) );
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
				}, { Opts.components } ).then( endpoint => Request.get( this.Endpoints.rootPath + endpoint ) );
			});
	   }
}

module.exports = Destiny2;