"use strict"

module.exports = ( uri, data ) => {
	if( typeof data !== 'object' )
		throw( "You did not provide an Object containing your key/value pairs");
	
	let rendered = uri;
	let search = '';
	Object.keys( data ).forEach( key => {
		search = RegExp('{' + key + '}', 'g');
		rendered = rendered.replace( search, data[key] );
	});
	
	return encodeURI( encoded );
}