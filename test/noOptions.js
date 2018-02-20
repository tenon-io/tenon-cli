'use strict';

const { parseCommand, filteredOptions } = require('../testIndex');
import assert from 'assert';

function make_red(txt) {
  return console.log(txt); //display the help text in red on the console
}

describe('No options', function() {
  it('No options should be set except for default options, which should have default values', function() {
    const args = [
      '/usr/local/bin/node',
      __dirname,
    ];
    const program = parseCommand(args);
    // Values are stored here based on Commander.js
    const nonDefaultOptions = filteredOptions(program);
    assert.equal(0, nonDefaultOptions.length);
  });
});
