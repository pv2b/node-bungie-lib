"use strict"
/**
 * @module UriRenderer
 * @exports render
 */

/**
 * @function
 * @param { string } uri - The URI string to be rendered
 * @param { Object } PathParams - The PathParams required to render this URI
 * @param { Object } QueryStrings - An object containing all of the query strings to be added to the end of the URI
 */
function render( uri, PathParams, QueryStrings ){
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
			rendered += "?";
			Object.keys( QueryStrings ).forEach( key => {
				rendered += key  + "=" + QueryStrings[key] + '&';
			});
		}
		
		resolve( encodeURI( rendered ) );
	});
};

module.exports = render;
