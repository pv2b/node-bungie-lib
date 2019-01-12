/** @module GroupV2/Enums */

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

module.exports = {
	bungieMembershipType : bungieMembershipType
}