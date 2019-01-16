/** @module GroupV2/Enum */
"use strict"

const map   = require( __dirname + '/../microLib/main.js' ).mapEnumSync;
const debug = require( 'debug' )( 'GroupV2/Enum' );

/**
 * @readonly
 * @enum { number } represents the forum category filters
 */
const bungieMembershipType = {
	/** NO fucking clue. They didn't document it. */
	"NONE" : 0,
	/** Obviously a giant killer feline xbox */
	"TIGERXBOX" : 1,
	/** Obviously a giant killer fline play station network */
	"TIGERPSN" : 2,
	/** Obviously a dumb name */
	"TIGERBLIZZARD": 4,
	/** No documentation */
	"TIGERDEMON" : 10,
	/** No documentation */
	"BUNGIENEXT":254,
	/**"All" is only valid for searching capabilities: you need to pass the actual matching BungieMembershipType for any query where you pass a known membershipId.*/
	"ALL" : "-1"
};

/**
 * @readonly
 * @enum { number }represents the group date range
 */
const groupDateRange = {
	/** Any range */
	"ALL"       : 0,
	/** In the past 24 hours */
	"PASTDAY"   : 1,
	/** In the past 7 days */
	"PASTWEEK"  : 2,
	/** In the past 30 days */
	"PASTMONTH" : 3,
	/** In the past 365 days */
	"PASTYEAR"  : 4
}

/**
 * @readonly
 * @enum { number } represents the group types
 */
const groupType = {
	/** A General group */
	"GENERAL" : 0,
	/** A clan */
	"CLAN"    : 1
}

/**
 * @readonly
 * @enum { number } represents group count filter
 */
const groupMemberCountFilter = {
	/** Any group, regardless of number of members */
	"ALL"                   : 0,
	/** Only return groups with between one and ten members, inclusive */
	"ONETOTEN"              : 1,
	/** Only return groups with between eleven and one hundred members, inclusive */
	"ELEVENTOONEHUNDRED"    : 2,
	/** Only return group with more than one hundred members */
	"GREATERTHANONEHUNDRED" : 3
};

/**
 * @readonly
 * @enum { number } represents group sort filter
 */
const groupSortBy = {
	/** Sort by name */
	"NAME"       : 0,
	/** Sory by date */
	"DATE"       : 1,
	/** Sort by popularity */
	"POPULARITY" : 2,
	/** Sort by ID */
	"ID"         : 3
}

/**
 * @readonly
 * @enum { number } represents membership options
 */
const membershipOption = {
	/** Undocumented */
	"REVIEWED"  : 0,
	/** Undocumented */
	"OPEN"      : 1,
	/** Undocumented */
	"CLOSED"    : 2
}

/**
 * @readonly
 * @enum { number } represents the chat security setting
 */
const chatSecuritySetting = {
	/** Undocumented */
	"GROUP"  : 0,
	/** Undocumented */
	"ADMINS" : 1
}

/**
 * @readonly
 * @enum { number } represents a group homepge
 */
const groupHomepage = {
	/** Undocumented */
	"WALL"          : 0,
	/** Undocumented */
	"FORUM"         : 1,
	/** Undocumented */
	"ALLIANCEFORUM" : 2	
}

module.exports = {
	bungieMembershipType : map( bungieMembershipType ),
	groupDateRange       : map( groupDateRange ),
	groupType            : map( groupType ),
	groupSortBy          : map( groupSortBy ),
	membershipOption     : map( membershipOption ),
	chatSecuritySetting  : map( chatSecuritySetting ),
	groupHomepage        : map( groupHomepage )
}