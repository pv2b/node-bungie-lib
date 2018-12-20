"use strict"

const Fs = require ( 'fs' );
const Path = require( 'path' );
const ModuleError = require( __dirname + "/lib/moduleLib/ModuleError.js");
/**
 * Wraps the endpoint micro-libraries to make API management easier. While
 * the micro-libraries are designed to be modular and can operate fully independent
 * of this wrapper; I strongly suggest you start by using the wrapper. It's very handy ;)
 * @class
 */
class BNet_Api{
	/**
	 * Initializes all specified libraries
	 * @param { Object } ApiAuth - The ApiAuthorization credentials that you were given when you created your project at https://www.bungie.net/en/Application
	 *   @property { string } ApiAuth.key - The API key that you were given when you created your project at https://www.bungie.net/en/Application
	 * @param { array } loadModules - An array of modules to load
	 */
	constructor( ApiAuth, loadMods = ['all'] ){
		
		// Sanity check
		if( typeof ApiAuth.key !== 'string')
			throw new Error( "your key '" + ApiAuth.key + "' appears to be invalid. Is it a string?" );
		if( ! parseInt( ApiAuth.clientId ) )
			throw new Error( "The clientId '" + ApiAuth.clientId + "' could not be parsed" );
		
		this.ApiAuth = ApiAuth;
		this.modules = {}
		
		// Parse the array of modules
		JSON.parse ( Fs.readFileSync( __dirname + '/modules.json' ) ).forEach( module => {
			this.modules[module.name] = module;
		});
		
		// Loads all modules by default
		if( ! Array.isArray( loadMods ) ) {
			console.warn( "Warning, loadModules was expected to be an array, got " + typeof loadMods);
			console.warn( "-=-=-=-=- Loading all modules by default -=-=-=-=-" );
			loadMods = ['all'];
		}	
		
		// Load all modules
		if( loadMods[0] == 'all' ){
			// For each module with an entry in modules.json
			Object.keys( this.modules ).forEach( key => {
				// Try to create an instance of the module and store it to this.{module name}. 
				try{
					this[this.modules[key].wrapperKey] = new( require( __dirname + this.modules[key].path + this.modules[key].main ) )( this.ApiAuth );
				} catch( e ){
					throw new ModuleError( {
						message : "The module " + this.modules[key].name + " failed to load",
						reason : e,
						module : this.modules[key]
					} );
				}
			})
		// Load only the supplied modules
		} else {
			loadMods.forEach( moduleName => {
				// Is there an entry for this module in modules.json?
				if( typeof this.modules[moduleName] !== 'object'){
					// Nope!, throw an error
					throw new ModuleError({
						message: "The module " + moduleName + " failed to load",
						reason: "The module " + moduleName + " does not have an entry in modules.json"
					});
				// Yep! try to load it
				} else {
					// cache the module in question
					let mod = this.modules[moduleName];
					// Try to create a new instance of the module
					try{
						this[module.wrapperKey] = new( require( __dirname + mod.path + mod.main ) )( this.ApiAuth );
					// Something went wrong, panic and run in a circle
					}catch( e ){
						throw new ModuleError({
							message: "The module " + moduleName + " failed to load",
							reason : e,
							module: this.modules[moduleName]
						});
					}
				}
			} );
		}
	}
}

module.exports = BNet_Api;