/** @module oAuth/Endpoint */
"use strict"
 
 /** An object containing all oAuth endpoints */
const Endpoints = {
	rootPath      : "https://www.bungie.net/Platform",
	authorization : "https://www.bungie.net/en/OAuth/Authorize",
	token         : "https://www.bungie.net/Platform/App/OAuth/token/",
	refresh       : "https://www.bungie.net/Platform/App/OAuth/token/"
}

module.exports = Endpoints;