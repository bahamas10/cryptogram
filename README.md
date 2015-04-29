cryptogram
==========

cryptogram puzzle solver helper script for node.js

Installation
-----------

    npm install [-g] cryptogram

Usage
-----

### CLI

Think of this like `tr(1)` specifically for solving encoded messages

    $ cat puzzle.txt
    ozwe we t eikdio rbd ozi kdxyobvdta hbsi ue absgmi zimyid absgmi.

Knowing that `kdxyobvdta` is `cryptogram`, we can run

    $ cat puzzle.txt | cryptogram kdxyobvdta cryptogram
    t*** ** a **cr*t *or t** cryptogram *o** ** mo**** ***p*r mo****.

Then solving it becomes a matter of testing it out letter by letter to uncover
more of the meaning.

If a first word or clue is not known, you'll have to invoke a more brute-force
method by:

1. finding the longest word
2. testing all words of that length using `-w` for a word list

Since `kdxyobvdta` is the longest word at 10 characters, compile a dictionary
and test it:

    $ awk 'length($0) == 10' /usr/share/dict/words > 10-letter-words.txt
    $ cat puzzle.txt | cryptogram -w 10-letter-words.txt kdxyobvdta
    "kdxyobvdta" => "gonimolobe"
    m*** ** b **go*m *oo m** gonimolobe *o** ** eo**** ***i*o eo****.

    "kdxyobvdta" => "gonotokont"
    t*** ** n **go*t *oo t** gonotokont *o** ** to**** ***o*o to****.

    "kdxyobvdta" => "gopherroot"
    e*** ** o **go*e *ro e** gopherroot *r** ** tr**** ***h*o tr****.
    ...

Then just sift through this list looking for words that are "most likely" to match.

### API

#### `cryptogram(message, from, to, opts = {})`

``` js
var cryptogram = require('cryptogram');
var message = 'ozwe we t eikdio rbd ozi kdxyobvdta hbsi ue absgmi zimyid absgmi.';

var decoded = cryptogram(message, 'kdxyobvdta', 'cryptogram');
console.log(decoded);
// => "t*** ** n **go*t *oo t** gonotokont *o** ** to**** ***o*o to****."
```

- `opts.character` - character used for unknowns, defaults to `*`

License
-------

MIT License
