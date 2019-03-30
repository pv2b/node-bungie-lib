/*
Copyright (c) 2019 Arnout Kazemier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

var path = require('path')
  , fs = require('fs');

/**
 * Attempt to somewhat safely parse the JSON.
 *
 * @param {String} data JSON blob that needs to be parsed.
 * @returns {Object|false} Parsed JSON or false.
 * @api private
 */
function parse(data) {
  data = data.toString('utf-8');

  //
  // Remove a possible UTF-8 BOM (byte order marker) as this can lead to parse
  // values when passed in to the JSON.parse.
  //
  if (data.charCodeAt(0) === 0xFEFF) data = data.slice(1);

  try { return JSON.parse(data); }
  catch (e) { return false; }
}

var iteratorSymbol = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.iterator : null;
/**
 * Add `Symbol.iterator` method if Symbols are available
 *
 * @param {Object} Iterator interface.
 * @returns {Object} Iterator interface.
 * @api private
 */
function addSymbolIterator(result) {
  if (!iteratorSymbol) {
    return result;
  }
  result[iteratorSymbol] = function () { return this; };
  return result;
}

/**
 * Find package.json files.
 *
 * @param {String|Object} root The root directory we should start searching in.
 * @returns {Object} Iterator interface.
 * @api public
 */
module.exports = function find(root) {
  root = root || process.cwd();
  if (typeof root !== "string") {
    if (typeof root === "object" && typeof root.filename === 'string') {
      root = root.filename;
    } else {
      throw new Error("Must pass a filename string or a module object to finder");
    }
  }
  return addSymbolIterator({
    /**
     * Return the parsed package.json that we find in a parent folder.
     *
     * @returns {Object} Value, filename and indication if the iteration is done.
     * @api public
     */
    next: function next() {
      if (root.match(/^(\w:\\|\/)$/)) return addSymbolIterator({
        value: undefined,
        filename: undefined,
        done: true
      });

      var file = path.join(root, 'package.json')
        , data;

      root = path.resolve(root, '..');

      if (fs.existsSync(file) && (data = parse(fs.readFileSync(file)))) {
        data.__path = file;

        return addSymbolIterator({
          value: data,
          filename: file,
          done: false
        });
      }

      return next();
    }
  });
};
