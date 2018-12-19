"use strict"
/**
 * @module UriRenderer
 * @exports render
 */

/**
 * @function
 * @param { string } uri - The URI string to be rendered
 * @param { Object } data - The data required to render this URI
 */
function render( uri, data ){
	return new Promise( ( resolve, reject) => {
		if( typeof data !== 'object' )
			reject( "You did not provide an Object containing your key/value pairs");
		if( typeof uri !== 'string')
			reject("The uri " + uri + " is not valid");
		
		//
		var rendered = uri;
		let search = '';
		Object.keys( data ).forEach( key => {
			search = RegExp('{' + key + '}', 'g');
			rendered = rendered.replace( search, data[key] );
		});
		
		resolve( encodeURI( rendered ) );
	});
};

module.exports = render;
