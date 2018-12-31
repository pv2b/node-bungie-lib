/** @module MicroLib */
"use strict"

const Fs = require( 'fs' );
const QueryString = require( 'querystring' );
/** Contains the parsed contents of the package.json file */
const libInfo = JSON.parse( Fs.readFileSync( __dirname + '/../../package.json' ) );

/**
 * Generates a generic User-Agent header
 * @function
 * @returns { string } The default user agent for this library
 */
function defaultUserAgent(){
	return "bungie-net-library/" + libInfo.version + " AppId/null (+https://www.tylermeador.com/bungie-net-library;no-contact-email)";
}

class TypeError extends Error{
	/**
	 * @constructor
	 * @extends Error
	 * @param { Object } TypeError - Contains the information about the TypeError
	 *   @property { string } varName - The name of the variable that filed the type check
	 *   @property { var } variable - The variable that failed the type check
	 *   @property { string } expected - The expected data type
	 * @example
	 * throw new TypeError({
	 *    varName: "Options.search",
	 *    variable: Options.search,
	 *    expected: "number-like"
	 * });
	 *
	 * @example
	 * { TypeError: TypeError:  Options.search expected to be number-like; Got string
     *      at new TypeError ...
     *      name: 'TypeError',
     *      varName: 'Options.search',
     *      expected: 'number-like',
     *      failedValue: 'THIS_IS_NOT_A_NUM' }
	 */
	constructor( TypeError ){
		super( "TypeError:  " + TypeError.varName + " expected to be " + TypeError.expected + "; Got " + typeof TypeError.variable );

		this.name = this.constructor.name;
		this.varName = TypeError.varName;
		this.expected = TypeError.expected;
		this.failedValue = TypeError.variable;

		Error.captureStackTrace( this, TypeError );
	}
}
 
class MicroLibLoadError extends Error{
	/**
	 * @constructor
	 * @extends Error
	 * @param { Object } MicroLibError - Contains the information about the module that failed
	 *   @property { string } message - A description of the error that occurred
	 *   @property { string } reason - The reason that the module failed to load
	 *   @property { MicroLibDefinition } Module - An object containing all of the module information
	 * @example
	 * throw new MicroLibLoadError({
	 *    message: "The micro-library testLib failed to load",
	 *    reason: "The main file for this module could not be found",
	 *    Module: {
	 *      name: "testLib",
	 *      wrapperKey: "Test",
	 *      main: "doesNotExist.js",
	 *      path: "/lib/testLib"
	 *    }
	 * });
	 */
	constructor( MicroLibError ){
		super( MicroLibError.message );

		this.name = this.constructor.name;

		Object.keys( MicroLibError ).forEach( key => {
			this[key] = MicroLibError[key];
		});

		Error.captureStackTrace( this, MicroLibLoadError );
	}
}
 
class EnumError extends Error{
	/**
	 * @constructor
	 * @extends Error
	 * @param { Object } EnumError - Contains the information about the failed enumeration lookup
	 *   @property { string } Table - The table in which the key does not exist
	 *   @property { string } key - The key that failed the lookup
	 * @example
	 * throw new EnumError({
	 *    key: "this_key_does_not_exist",
	 *    Table: Forum.Enums.topicsQuickDate
	 * });
	 *
	 * @example
	 * { EnumError: this_key_does_not_exist is not a valid quick date
	 *  at ...
	 * name: 'EnumError',
	 * key: 'this_key_does_not_exist',
	 * lookupTable:
	 *  { '0': 'ALL',
	 *	 '1': 'LASTYEAR',
	 *	 '2': 'LASTMONTH',
	 *	 '3': 'LASTWEEK',
	 *	 '4': 'LASTDAY',
	 *	 description: 'quick date',
	 *	 ALL: 0,
	 *	 LASTYEAR: 1,
	 *	 LASTMONTH: 2,
	 *	 LASTWEEK: 3,
	 *	 LASTDAY: 4 } }
	 *
	 */
	constructor( EnumError ){
		super( EnumError.key + " is not a valid " + EnumError.Table.description );

		this.name = this.constructor.name;
		this.key = EnumError.key;
		this.lookupTable = EnumError.Table

		Error.captureStackTrace( this, EnumError );
	}
}


/**
 * Checks if the first parameter `key` is a key in the Enum object `Table`
 * @function
 * @param { Object } key - The key to look up
 * @param { Object } Table - The Enum Table in which to look for the key
 * @returns { Promise } - Resolves with the enumerated value, rejects with an {@link module:EnumError~EnumError|EnumError}
 */
async function enumLookup( key, Table ){
	return new Promise( (resolve, reject) => {
		let typeOf = typeof Table[key];
		if( typeOf !== 'number' && typeOf !== 'string' )
			reject( new EnumError( {
				key   : key,
				Table : Table
			} ) );
		if( typeOf == 'number' )
			resolve ( Table[key] );
		else
			resolve ( key );
	} );
}
 
/**
 * URI enpoints are saved directly from Bungie with the placeholders in tact. The placeholders  in the path each represent
 * an API parameter.
 * @function
 * @param { string } uri - The URI string to be rendered
 * @param { Object } PathParams - The PathParams required to renderEndpoint this URI
 * @param { Object } QueryStrings - An object containing all of the query strings to be added to the end of the URI
 * @example
 * // Function is thenable
 *
 * let endpoint = "https://www.Bungie.net/some/path/{placeholder_1}/{second_placeholder}/{foo}";
 * renderEndpoint( endpoint,
 *     { // PathParams - These go directly in the URI
 *        placeholder_1 : 'HELLO',
 *        second_placeholder: 'WORLD',
 *        foo: 'bar'
 *    },
 *    { // QueryStrings - These are appeneded on to the end of URI and are used for HTTP GET requests
 *        "key": "value",
 *        "second" : 2
 *    }).then( uri => {
 *        console.log( uri );
 *    });
 *
 * @example
 * // Async/await
 * async function test(){
 *   let endpoint = "https://www.Bungie.net/some/path/{placeholder_1}/{second_placeholder}/{foo}";
 *   let uri = await renderEndpoint( endpoint,
 *       { // These replace the placeholders present in the URI path
 *          placeholder_1 : 'HELLO',
 *          second_placeholder: 'WORLD',
 *          foo: 'bar'
 *      },
 *      { // These are queryStrings
 *          "key": "value",
 *          "second" : 2
 *      });
 *     console.log( uri );
 * }
 *
 * @example { Output }
 * // Both examples above produce this output
 * "https://www.Bungie.net/som/path/HELLO/WORLD/bar?key=value&second=2"
 */
async function renderEndpoint( uri, PathParams = {}, QueryStrings = null ){
	return new Promise( ( resolve, reject) => {
		if( typeof PathParams !== 'object' )
			reject( "You did not provide an Object containing your key/value pairs");
		if( typeof uri !== 'string')
			reject("The uri " + uri + " is not valid");

		var rendered = uri;
		let search = '';

		// Render the path params
		Object.keys( PathParams ).forEach( key => {
			// Don't render any undefined values
			if( typeof PathParams[key] == 'undefined' || PathParams[key] === "" )
				return;
			search = RegExp('{' + key + '}', 'g');
			rendered = rendered.replace( search, PathParams[key] );
		});

		// If there are still placeholders in the URI, reject the promise.
		let missingParams = rendered.match( /{\s*[\w\.]+\s*}/g );
		if( missingParams !== null ){
			// Pull values out of the braces
			missingParams = missingParams.map( x => { return x.match( /[\w\.]+/)[0] } );
			reject( {
				message: "Parameters were missing from the request",
				missingParams: missingParams
			} );
		}

		// Add any query strings we were sent
		if( typeof QueryStrings == 'object' )
			rendered += "?" + QueryString.stringify( QueryStrings );

		resolve( encodeURI( rendered ) );
	});
};

class ApiError extends Error{
	/**
	 * @constructor
	 * @extends Error
	 * @param { Object } bNetError - The parsed bungee.net API error message.
	 *   @property { number } ErrorCode - The error code of the Bungie.net error
	 * 	 @property { number } ThrottleSeconds - The number of seconds that your API key was throttled
	 *   @property { string } ErrorStatus - A string containing the status of the API call. 
	 *   @property { string } Message - A message from the gods themselves. 
	 */
	constructor( bNetError ){
		super( bNetError.Message );
		
		this.name = this.constructor.name;
		
		Object.keys( bNetError ).forEach( key => {
			this[key] = bNetError[key];
		});
		
		Error.captureStackTrace( this, ApiError );
	}
}
module.exports = {
	TypeError : TypeError,
	ApiError  : ApiError,
	MicroLibLoadError : MicroLibLoadError,
	renderEndpoint : renderEndpoint,
	enumLookup: enumLookup,
	EnumError : EnumError,
	defaultUserAgent : defaultUserAgent,
	libInfo : libInfo
}
