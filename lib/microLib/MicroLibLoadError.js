"use strict"
class MicroLibLoadError extends Error{
	/**
	 * @constructor
	 * @extends Error
	 * @param { Object } MicroLibError - Contains the information about the module that failed
	 *   @property { string } message - A description of the error that occurred
	 *   @property { string } reason - The reason that the module failed to load
	 *   @property { MicroLibDefinition } Module - An object containing all of the module information
	 * @example
	 * throw new MicroLibLoadError({
	 *    message: "The micro-library testLib failed to load",
	 *    reason: "The main file for this module could not be found",
	 *    Module: {
	 *      name: "testLib",
	 *      wrapperKey: "Test",
	 *      main: "doesNotExist.js",
	 *      path: "/lib/testLib"
	 *    }
	 * });
	 */
	constructor( MicroLibError ){
		super( MicroLibError.message );

		this.name = this.constructor.name;

		Object.keys( MicroLibError ).forEach( key => {
			this[key] = MicroLibError[key];
		});

		Error.captureStackTrace( this, MicroLibLoadError );
	}
}
module.exports = MicroLibLoadError;
