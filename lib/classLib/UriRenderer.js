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
			search = RegExp('{' + key + '}', 'g');
			rendered = rendered.replace( search, PathParams[key] );
		});
		
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
