"use strict"


/**
 * @module App
 */
const Fs = require( 'fs' );
const libInfo = JSON.parse( Fs.readFileSync( __dirname + '/../../package.json' ) );

/**
 * Generates a generic User-Agent header
 * @function
 * @returns { string } The default user agent for this library
 */
function defaultUserAgent(){
	return "bungie-net-library/" + libInfo.version + " AppId/null (+https://www.tylermeador.com/bungie-net-library;no-contact-email)";
}

module.exports = {
	defaultUserAgent: defaultUserAgent,
	libInfo: libInfo
}
