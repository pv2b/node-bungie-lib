"use strict"
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
module.exports = ApiError;