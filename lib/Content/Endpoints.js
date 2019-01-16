"use strict"

const endpoints = {
	rootPath               : "https://www.bungie.net/Platform",
	authorization          : "https://www.bungie.net/en/oauth/authorize",
	token                  : "https://www.bungie.net/platform/app/oauth/token/",
	getContentType         : "/Content/GetContentType/{type}/",
	getContentById         : "/Content/GetContentById/{id}/{locale}/",
	getContentByTagAndType : "/Content/GetContentByTagAndType/{tag}/{type}/{locale}/",
	getContentWithText     : "/Content/Search/{locale}/",
	getContentByTagAndType : "/Content/SearchContentByTagAndType/{tag}/{type}/{locale}/",
	searchContentWithText  : "/Content/Search/{locale}/"
}
module.exports = endpoints;