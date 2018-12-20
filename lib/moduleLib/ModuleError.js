"use strict"
class ModuleError extends Error{
	/**
	 * @constructor
	 * @extends Error
	 * @param { Object } ModuleError - Contains the information about the module that failed
	 *   @property { string } ModuleError.message - A description of the error that ocurred
	 *   @property { string }
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