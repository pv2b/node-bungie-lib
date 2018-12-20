"use strict"
class ModuleError extends Error{
	/**
	 * @constructor
	 * @extends Error
	 * @param { Object } ModuleError - Contains the information about the module that failed
	 *   @property { string } ModuleError.message - A description of the error that occurred
	 *   @property { string } reason - The reason that the module failed
	 *   @property { Object } Module - An object containing all of the module information
	 *     @property { string } Module.name - The name of the module
	 *     @property { string } Module.wrapperKey - The name of the property that gets created in BNet_Api.js
	 *     @property { string } Module.main - The name of the main module file. Should export a constructor or class
	 *     @property { string } Module.path - The path to the root folder of the module
	 */
	constructor( ModError ){
		super( ModError.message );
		
		this.name = this.constructor.name;
		
		Object.keys( ModError ).forEach( key => {
			this[key] = ModError[key];
		});
		
		Error.captureStackTrace( this, ModuleError );
	}
}
module.exports = ModuleError;