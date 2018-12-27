"use strict"
/**
 * @module UriRenderer
 * @exports render
 */

const QueryString = require( 'querystring' );
 
/**
 * URI enpoints are saved directly from Bungie with the placeholders in tact. The placeholders  in the path each represent
 * an API parameter.
 * @function
 * @param { string } uri - The URI string to be rendered
 * @param { Object } PathParams - The PathParams required to render this URI
 * @param { Object } QueryStrings - An object containing all of the query strings to be added to the end of the URI
 * @example
 * // Function is thenable
 *
 * let endpoint = "https://www.Bungie.net/some/path/{placeholder_1}/{second_placeholder}/{foo}";
 * render( endpoint,
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
 *   let uri = await render( endpoint,
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
function render( uri, PathParams = {}, QueryStrings = {} ){
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
			if( typeof PathParams[key] == 'undefined' )
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
		if( typeof QueryStrings == 'object' ){
			rendered += "?" + QueryString.stringify( QueryStrings );;
			
			/* Old method
			Object.keys( QueryStrings ).forEach( key => {
				rendered += key  + "=" + QueryStrings[key] + '&';
			});*/
		}

		resolve( encodeURI( rendered ) );
	});
};

module.exports = render;
