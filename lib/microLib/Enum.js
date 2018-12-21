"use strict"
/**
 * @module EnumLookup
 */
class EnumError extends Error{
	/**
	 * @constructor
	 * @extends Error
	 * @param { Object } EnumError - Contains the information about the failed enumeration lookup
	 *   @property { string } Table - The table in which the key does not exist
	 *   @property { string } key - The key that failed the lookup
	 * @example
	 * throw new EnumError({
	 *    key: "this_key_does_not_exist",
	 *    Table: Forum.Enums.topicsQuickDate
	 * });
	 *
	 * @example
	 * { EnumError: this_key_does_not_exist is not a valid quick date
	 *  at ...
	 * name: 'EnumError',
	 * key: 'this_key_does_not_exist',
	 * lookupTable:
	 *  { '0': 'ALL',
	 *	 '1': 'LASTYEAR',
	 *	 '2': 'LASTMONTH',
	 *	 '3': 'LASTWEEK',
	 *	 '4': 'LASTDAY',
	 *	 description: 'quick date',
	 *	 ALL: 0,
	 *	 LASTYEAR: 1,
	 *	 LASTMONTH: 2,
	 *	 LASTWEEK: 3,
	 *	 LASTDAY: 4 } }
	 *
	 */
	constructor( EnumError ){
		super( EnumError.key + " is not a valid " + EnumError.Table.description );
		
		this.name = this.constructor.name;
		this.key = EnumError.key;
		this.lookupTable = EnumError.Table
		
		Error.captureStackTrace( this, EnumError );
	}
}
 
 
/**
 * @function
 * @param { Object } key - The key to look up
 * @param { Object } Table - The Enum Table in which to look for the key
 * @returns { Promise } - Resolves with the enumerated value, rejects with an {@link module:EnumError~EnumError|EnumError}
 */
async function enumLookup( key, Table ){
	return new Promise( (resolve, reject) => {
		let typeOf = typeof Table[key];
		if( typeOf !== 'number' && typeOf !== 'string' )
			reject( new EnumError( {
				key   : key,
				Table : Table
			} ) );
		if( typeOf == 'number' )
			resolve ( Table[key] );
		else
			resolve ( key );
	} );
}

module.exports = {
	EnumError  : EnumError,
	enumLookup : enumLookup
}