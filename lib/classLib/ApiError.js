"use strict"

/**
 *	Creates an ApiError object
 * @class
 */
module.exports = class ApiError extends Error{
	constructor( bNetError ){
		super( bNetError.Message );
		
		this.name = this.constructor.name;
		
		Object.keys( bNetError ).forEach( key => {
			this[key] = bNetError[key];
		});
		
		Error.captureStackTrace( this, ApiError );
	}
}