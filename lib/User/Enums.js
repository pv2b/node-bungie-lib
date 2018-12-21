"use strict"

const bungieMembershipType = {
	"ALL": -1,
	"NONE" : 0,
	"TIGERXBOX" : 1,
	"TIGERPSN" : 2,
	"TIGERBLIZZARD" : 4,
	"TIGERDEMON" : 10,
	"BUNGIENEXT" : 254,
	"-1" : "ALL",
	0 : "NONE",
	1 : "TIGERXBOX",
	2 : "TIGERPSN",
	4 : "TIGERBLIZZARD",
	10: "TIGERDEMON",
	254 : "BINGIENEXT"
}

module.exports = {
	bungieMembershipType: bungieMembershipType
}