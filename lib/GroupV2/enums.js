/** @module GroupV2/Enum */

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
	"ALL" : "-1",
	0 : "NONE",
	1 : "TIGERXBOX",
	2 : "TIGERPSN",
	4 : "TIGERBLIZZARD",
	10 : "TIGERDEMON" ,
	254 : "BUNGIENEXT",
	"-1" : "ALL"
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
	"PASTYEAR"  : 4,
	0 : "ALL",
	1 : "PASTDAY",
	2 : "PASTWEEK",
	3 : "PASTMONTH",
	4 : "PASTYEAR"
}

/**
 * @readonly
 * @enum { number } represents the group types
 */
const groupType = {
	/** A General group */
	"GENERAL" : 0,
	/** A clan */
	"CLAN"    : 1,
	0 : "GENRAL",
	1 : "CLAN"
}

/**
 * @readonly
 * @enum { number } represents group count filter
 */
const groupMemberCountFilter = {
	"ALL"                   : 0,
	"ONETOTEN"              : 1,
	"ELEVENTOONEHUNDRED"    : 2,
	"GREATERTHANONEHUNDRED" : 3,
	0 : "ALL",
	1 : "ONETOTEN",
	2 : "ELEVENTOONEHUNDRED",
	3 : "GREATERTHANONEHUNDRED"
};

/**
 * @readonly
 * @enum { number } represents group count filter
 */
const groupSortBy = {
	"NAME"       : 0,
	"DATE"       : 1,
	"POPULARITY" : 2,
	"ID"         : 3,
	0 : "NAME",
	1 : "DATE",
	2 : "POPULARITY",
	3 : "ID"
}

module.exports = {
	bungieMembershipType : bungieMembershipType,
	groupDateRange : groupDateRange,
	groupType : groupType,
	groupSortBy : groupSortBy
}