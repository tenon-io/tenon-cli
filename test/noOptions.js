'use strict';

const { parseCommand } = require('../testIndex');
import assert from 'assert';

describe('No options', function() {
  it('No options should be set except for default options, which should have default values', function() {
    const args = [
      '/usr/local/bin/node',
      __dirname,
    ];
    const program = parseCommand(args);
    // Values are stored here based on Commander.js
    const objectWithArgs = program.commands[0].parent;
    assert.equal(objectWithArgs.endpoint, 'https://tenon.io/api/');
  });
});
