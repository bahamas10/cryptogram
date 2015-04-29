/**
 * cryptogram solver helper - like `tr` but designed specifically to this end
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: March 09, 2015
 * License: MIT
 * Credits: Home Loaf
 */

var f = require('util').format;

module.exports = cryptogram;
function cryptogram(message, fromword, toword, opts) {
  var i, e;
  opts = opts || {};
  opts.character = opts.character || '*';

  // assert lengths are equal
  if (fromword.length !== toword.length) {
    e = new Error(f('%s different length (%d) than original word (%d)',
        toword, toword.length, fromword.length));
    e.code = 'length mismatch';
    throw e;
  }

  // create a map
  var map = {};
  for (i = 0; i < toword.length; i++) {
    var fromC = fromword[i];
    var toC = toword[i];

    // make sure the map doesn't collide
    if (map.hasOwnProperty(fromC) && map[fromC] !== toC) {
      e = new Error('map collision');
      e.code = 'map collision';
      throw e;
    }

    map[fromC] = toC;
  }

  // map was good, create the whole message
  var ret = '';
  for (i = 0; i < message.length; i++) {
    var c = message[i];
    ret += map.hasOwnProperty(c) ? map[c] : (/[A-Za-z0-9]/.test(c) ? opts.character : c);
  }

  return ret;
}
