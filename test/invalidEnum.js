'use strict';

const { parseCommand } = require('../testIndex');
import assert from 'assert';

describe('Enum option with invalid value', function() {
  it('the enum\'d option should have it\'s default value', function() {
    const args = [
      '/usr/local/bin/node',
      __dirname,
      '--certainty=test',
      'http://example.com'
    ];
    const program = parseCommand(args);
    // Values are stored here based on Commander.js
    const objectWithArgs = program.commands[0].parent;
    assert.equal(objectWithArgs.certainty, 0);
  });
});
