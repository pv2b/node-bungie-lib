"use strict"
/**
 * @module {enum} User/Enum
 */

/**
 * @readonly
 * @enum { number } - The types of membership the Accounts system supports. This is the external facing enum used in place of the internal-only Bungie.SharedDefinitions.MembershipType.
 */
const bungieMembershipType = {
	/** Use any Bungie membership type */
	"ALL": -1,
	/** Use no Bungie membership type */
	"NONE" : 0,
	/** XBox membership type */
	"TIGERXBOX" : 1,
	/** PlayStation membership type */
	"TIGERPSN" : 2,
	/** Blizzard.net membership type */
	"TIGERBLIZZARD" : 4,
	/** Demon membership type */
	"TIGERDEMON" : 10,
	/** Bungienext membership type */
	"BUNGIENEXT" : 254,
	/**
	 * Reverse lookup for "ALL"
	 * @type {string}
	 */
	"-1" : "ALL",
	/**
	 * Reverse lookup for "NONE"
	 * @type {string}
	 */
	0 : "NONE",
	/**
	 * Reverse lookup for "TIGERXBOX"
	 * @type {string}
	 */
	1 : "TIGERXBOX",
	/**
	 * Reverse lookup for ""TIGERPSN"
	 * @type {string}
	 */
	2 : "TIGERPSN",
	/**
	 * Reverse lookup for "TIGERBLIZZARD"
	 * @type {string}
	 */
	4 : "TIGERBLIZZARD",
	/**
	 * Reverse lookup for "TIGERDEMON"
	 * @type {string}
	 */
	10: "TIGERDEMON",
	/**
	 * Reverse lookup for "BUNGIENEXT
	 * @type {string}
	 */
	254 : "BUNGIENEXT"
}

module.exports = {
	bungieMembershipType: bungieMembershipType
}