"use strict"
class EnumError extends Error{
	/**
	 * @constructor
	 * @extends Error
	 * @param { Object } EnumError - Contains the information about the failed enumeration lookup
	 *   @property { string } description - What is the description of the enum?
	 *   @property { string } enumKey - The key that failed the lookup
	 * @example
	 * throw new EnumError({
	 *    enumKey: "this_key_does_not_exist",
	 *    enumTable: "Forum.Enums.quickDate"
	 * });
	 */
	constructor( EnumError ){
		super( EnumError.enumKey + " is not a valid " + EnumError.description );
		
		this.name = this.constructor.name;
		this.reason = EnumError.reason;
		
		Error.captureStackTrace( this, EnumError );
	}
}
module.exports = EnumError;