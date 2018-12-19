"use strict"
/**
 * @module UriRenderer
 * @exports render
 */

/**
 * @function
 * @param { string } uri - The URI string to be rendered
 * @param { Object } Data - The Data required to render this URI
 * @param { Object } QueryStrings - An object containing all of the query strings to be added to the end of the URI
 */
function render( uri, Data, QueryStrings ){
	return new Promise( ( resolve, reject) => {
		if( typeof Data !== 'object' )
			reject( "You did not provide an Object containing your key/value pairs");
		if( typeof uri !== 'string')
			reject("The uri " + uri + " is not valid");
		
		var rendered = uri;
		let search = '';
		
		Object.keys( Data ).forEach( key => {
			search = RegExp('{' + key + '}', 'g');
			rendered = rendered.replace( search, Data[key] );
		});
		
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
