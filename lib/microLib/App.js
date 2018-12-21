"use strict"

const Fs = require( 'fs' );
const libInfo = JSON.parse( Fs.readFileSync( __dirname + '/../../package.json') );

function defaultUserAgent(){
	return "bungie-net-library/" + libInfo.version + " AppId/null (+https://www.tylermeador.com/bungie-net-library;no-contact-email)";
}

module.exports = {
	defaultUserAgent: defaultUserAgent,
	libInfo : libInfo
}