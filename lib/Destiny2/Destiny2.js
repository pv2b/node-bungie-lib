/** @module Destiny2 */
"use strict"
const Ml = require( __dirname + "/../MicroLibrary.js" );
const debug = require( 'debug' )( 'Destiny2' );
const Fs = require( 'fs' );
const Util = require( 'util' );
const Path = require( 'path' );
var Manifest = null;
var Request = null;

class Destiny2{
	/**
	 * @param { ApiCreds } ApiCreds - Your API credentials
	 */
	constructor( ApiCreds ){
		this.ApiCreds  = ApiCreds;
		Manifest       = new  ( require( __dirname + '/Manifest.js' ) )( ApiCreds );
		Request        = new Ml.Request( ApiCreds );
		this.Manifest  = {};
		this.userAgent = ApiCreds.userAgent
		this.manifestFiles = [];
	}
	
	/**
	 * Initializes the specified manifest(s)
	 * @param { Array.string } [languages=['en']] - The languages of manifest that you will need
	 * @returns { Promise }
	 */
	async init( langs = [ 'en' ] ){
		let readDir = Util.promisify( Fs.readdir );
		let proms = [];
		return readDir( __dirname + '/manifests').then( files => {
			this.manifestFiles = files;
			langs.forEach( lang => {
				if( files.indexOf( lang + '.json' ) !== -1 )
					proms.push( this.loadManifest( lang ) );
				else
					proms.push( this.downloadManifest( lang ).then( x => this.loadManifest( lang ) ) );
			} );
			
			return Promise.all( proms ).then( x => "Destiny2 initialized" );
		} );
	}
	
	/**
	 * loads the specified manifest(s) from disk
	 * @param { Array.string } [language=['all']] - The language of manifest to load
	 * @returns { Promise }
	 */
	async loadManifest( lang = 'en' ){
		var startPath = __dirname + '/manifests/';
		
		return Util.promisify( Fs.readdir )( startPath ).then( files => {
			this.manifestFiles = files;
			let readFile = Util.promisify( Fs.readFile );
			let proms = [];
			debug( 'loading manifest ' + lang );
			files.forEach( file => {
				// Each manifest file is named lang.json. For instance the 'en' manifest JSON file is named en.json.
				if( lang === 'all' || file === lang + '.json' ){
					debug( 'found it! Loading....' );
					proms.push( readFile( Path.join( startPath, file ) ).then( contents => {
						this.Manifest[ lang ] = contents;
						debug( 'done!' );
						return this.Manifest[ lang ];
					} ) );
				}
			} );
			
			if( proms.length === 0 )
				return false;
			else
				return Promise.all( proms ).then( x => this.Manifest );
		} )
	}
	
	/**
	 * downloads the specified manifest and saves it to the disk as "./manifests/{language}.json"
	 * @param { Array.string } languages - The language of manifest to download
	 */
	async downloadManifest( lang = 'en' ){
		debug( 'downloading mainfiest ' + lang );
		let manifestContent = await Manifest.download( lang );
		let path = __dirname + '/manifests/' + lang + '.json';
		debug( 'writing manifest to file...' )
		Fs.writeFile( path, JSON.stringify( manifestContent ), err => {
			if( err ) throw err;
			debug( 'done!' );
			return path;
		} )
	}
	
	lookup(){
		
	}
}

module.exports = Destiny2;