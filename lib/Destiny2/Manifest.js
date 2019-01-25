/** @module Destiny2/Manifest */
"use strict"

const debug = require( 'debug' ) ( "Destiny2/Manifest" );
const fs = require( 'fs' );
const Ml = require( __dirname + '/../MicroLibrary.js' );
var Request = null;


class Manifest{
	/**
	 * Makes manifest management a breeze
	 * @param { ApiAuth } ApiAuth - Your Api credentials
	 */
	constructor( ApiAuth ){
		Request        = new Ml.Request( ApiAuth );
		this.Endpoints = require( __dirname + "/Endpoints.js" );
		this.Enums     = require( __dirname + "/Enums.js" );
		this._Meta     = null; // The meta data for the current manifest
		this.downloads = {};
		this.Contents  = {};
	
	}
	
	async getMeta(){
		debug( 'getting meta data ' )
		return new Promise( ( resolve, reject ) => {
			
			if( this._Meta === null ){
				debug( 'meta data does not exist, fetching...' )
				resolve( Request.get( this.Endpoints.rootPath + this.Endpoints.getDestinyManifest ) ).then( Meta => {
					debug( 'done!' );
					this._Meta = Meta;
					return Meta;
				} );
			} else {
				debug( 'done!' );
				resolve( this._Meta );
			}
		} );
	}
	
	download( lang = 'en' ){
		return this.getMeta().then( Meta => Request.get( this.Endpoints.rootPath + Meta.Response.jsonWorldContentPaths[ lang ], false ) );
	}
}

module.exports = Manifest;