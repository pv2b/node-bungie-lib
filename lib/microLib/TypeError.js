"use strict"
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
	 *    enumKey: "this_key_does_not_exist",
	 *    enumTable: "Forum.Enums.quickDate"
	 * });
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
module.exports = TypeError;