#!/usr/bin/env node
/**
 * cryptogram solver helper - like `tr` but designed specifically to this end
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: March 09, 2015
 * License: MIT
 * Credits: Home Loaf
 */

var fs = require('fs');

var cryptogram = require('../');
var getopt = require('posix-getopt');

var package = require('../package');

var usage = [
  'usage: cryptogram [string1] [string2]',
  '',
  'options',
  '  -c, --char <char>       character to use as filler, defaults to *',
  '  -d, --debug             enable debug output',
  '  -h, --help              print this message and exit',
  '  -u, --updates           check npm for available updates',
  '  -v, --version           print the version number and exit',
  '  -w, --wordfile <file>   file to use instead of arguments to test',
].join('\n');

// command line arguments
var options = [
  'c:(char)',
  'd(debug)',
  'h(help)',
  'u(updates)',
  'v(version)',
  'w:(wordfile)',
].join('');
var parser = new getopt.BasicParser(options, process.argv);

var option;
var character;
var debug = function debug() {};
var wordfile;
while ((option = parser.getopt()) !== undefined) {
  switch (option.option) {
    case 'c': character = option.optarg; break;
    case 'd': debug = console.error.bind(console); break;
    case 'h': console.log(usage); process.exit(0); break;
    case 'u': // check for updates
      require('latest').checkupdate(package, function(ret, msg) {
        console.log(msg);
        process.exit(ret);
      });
      return;
    case 'v': console.log(package.version); process.exit(0); break;
    case 'w': wordfile = option.optarg; break;
    default: console.error(usage); process.exit(1); break;
  }
}
var args = process.argv.slice(parser.optind());
var fromword = args[0];

// the word to translate from
if (!fromword) {
  console.error('word must be specified as first argument');
  process.exit(1);
}

// the word(s) to translate to
var towords = [];
if (args[1])
  towords = towords.concat(args.slice(1));
if (wordfile)
  towords = towords.concat(fs.readFileSync(wordfile, 'utf8').trim().split('\n'));

if (towords.length === 0) {
  console.error('word must be specified as second argument, or passed via -w <wordfile>');
  process.exit(1);
}

// read message from stdin
var message = fs.readFileSync('/dev/stdin', 'utf8').trim();

// loop the words we are translating to and build a map
var header = towords.length > 1;
towords.forEach(function(toword) {
  debug('testing word "%s"', toword);

  var s;
  try {
    s = cryptogram(message, fromword, toword, {character: character});
  } catch(e) {
    debug(e.message);
    return;
  }

  if (header)
    console.log('"%s" => "%s"', fromword, toword);
  console.log(s);
  if (header)
    console.log();
});
