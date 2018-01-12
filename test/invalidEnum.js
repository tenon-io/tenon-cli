'use strict';

const { parseCommand } = require('../testIndex');
import assert from 'assert';

describe('Enum option with invalid value', function() {
  after(function() {
    // runs after all tests in this block
  });
  
  it('the enum\'d option should have it\'s default value', function() {
    const args = [
      '/usr/local/bin/node',
      __dirname,
      '--certainty=test',
      'http://example.com'
    ];
    const program = parseCommand(args);
    assert.equal(true, program.certainty);
    assert.equal(program.certainty, true);
  });
});
