"use strict"

/**
 * @module { Enum } Content/Enum
 */

/**
 * @readonly
 * @enum { number } represents the forum category filters
 */
const contentPropertyDataType = {
	/** No data type */
	"NONE" : 0,
	/** PlainText data type */
	"PLAINTEXT" : 1,
	/** Html data type */
	"HTML" : 2,
	/** Dropdown data type */
	"DROPDOWN" : 3,
	/** List data type */
	"LIST" : 4,
	/** JSON data type */
	"JSON" : 5,
	/** Content data type */
	"CONTENT" : 6,
	/** Representation data type */
	"REPRESENTATION" : 7,
	/** Set data type */
	"SET" : 8,
	/** File data type */
	"FILE" : 9,
	/** Folderset data type*/
	"FOLDERSET" : 10,
	/** Date data type */
	"DATE" : 11,
	/** Mltiline-Plain-Text data type */
	"MULTILINEPLAINTEXT" : 12,
	/** Destiny-content data type */
	"DESTINYCONTENT" : 13,
	/** Color data type */
	"COLOR" : 14,
	/**
	 * reverse lookup for "NONE"
	 * @type {string}
	 */
	0 : "NONE",
	/**
	 * reverse lookup for "PLAINTEXT"
	 * @type {string}
	 */
	1 : "PLAINTEXT",
	/**
	 * reverse lookup for "HTML"
	 * @type {string}
	 */
	2 : "HTML",
	/**
	 * reverse lookup for "DROPDOWN"
	 * @type {string}
	 */
	3 : "DROPDOWN",
	/**
	 * reverse lookup for "LIST"
	 * @type {string}
	 */
	4 : "LIST",
	/**
	 * reverse lookup for "JSON"
	 * @type {string}
	 */
	5 : "JSON",
	/**
	 * reverse lookup for "CONTENT"
	 * @type {string}
	 */
	6 : "CONTENT",
	/**
	 * reverse lookup for "REPRESENTATION"
	 * @type {string}
	 */
	7 : "REPRESENTATION",
	/**
	 * reverse lookup for "SET"
	 * @type {string}
	 */
	8 : "SET",
	/**
	 * reverse lookup for "FILE"
	 * @type {string}
	 */
	9 : "FILE",
	/**
	 * reverse lookup for "FOLDERSET"
	 * @type {string}
	 */
	10 : "FOLDERSET",
	/**
	 * reverse lookup for "DATE"
	 * @type {string}
	 */
	11 : "DATE",
	/**
	 * reverse lookup for "MULTILINEPLAINTEXT"
	 * @type {string}
	 */
	12 : "MULTILINEPLAINTEXT",
	/**
	 * reverse lookup for "DESTINYCONTENT"
	 * @type {string}
	 */
	13 : "DESTINYCONTENT",
	/**
	 * reverse lookup for "COLOR"
	 * @type {string}
	 */
	14 : "COLOR"
}

module.exports = {
	contentPropertyDataType : contentPropertyDataType
}