"use strict"

const Fs = require( 'fs' );

module.exports = {
	TypeError : require( __dirname + '/TypeError.js' ),
	ApiError  : require( __dirname + '/ApiError.js' ),
	MicroLibLoadError : require( __dirname + '/MicroLibLoadError.js' ),
	renderEndpoint : require( __dirname + '/EndpointRenderer.js' ),
	enumLookup: require( __dirname + '/Enum.js' ).enumLookup,
	EnumError : require( __dirname + '/Enum.js' ).EnumError,
	defaultUserAgent : require( __dirname + '/App.js' ).defaultUserAgent,
	libInfo : require( __dirname + '/App.js' ).libInfo
}
