/** @module oAuth/Endpoint */
"use strict"
 
 /** An object containing all oAuth endpoints */
const Endpoints = {
	rootPath            : "https://www.bungie.net/Platform",
	authorization       : "https://www.bungie.net/en/OAuth/Authorize",
	token               : "/App/OAuth/token/",
	refresh             : "/App/OAuth/token/",
	getCommonSettings   : "/Settings/",
	getAvailableLocales : "/GetAvailableLocales/",
}

module.exports = Endpoints;