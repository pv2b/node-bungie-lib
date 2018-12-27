"use strict"


/**
 * @module Endpoints/User
 */
 /** An Object containing all "User" endpoints */
const endpoints = {
	rootPath                        : "https://www.bungie.net/Platform",
	authorization                   : "https://www.bungie.net/en/oauth/authorize",
	token                           : "https://www.bungie.net/platform/app/oauth/token/",
	getBungieNetUserById            : "/User/GetBungieNetUserById/{id}/",
	getSearchUsers                  : "/User/SearchUsers/",
	getAvailableThemes              : "/User/GetAvailableThemes/",
	getMembershipDataById           : "/User/GetMembershipsById/{membershipId}/{membershipType}/",
	getMembershipDataForCurrentUser : "/User/GetMembershipsForCurrentUser/",
	getPartnerships                 : "/User/{membershipId}/Partnerships/"
};

module.exports = endpoints;