/** @module GroupV2 */
"use strict"
const MicroLib = require( __dirname + "/../microLib/main.js" );
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
	async getUserClanInviteSettings( type, oAuth){
		return MicroLib.enumLookup( type, this.Enums.bungieMembershipType )
			.then( type => MicroLib.renderEndpoint( this.Endpoints.getUserClanInviteSetting, { mType : type  } ) )
		.then( endpoint => Request.get( this.Endpoints.rootPath + endpoint , oAuth ) );
	}

};

module.exports = GroupV2;