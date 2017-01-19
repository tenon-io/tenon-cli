'use strict';

const { parseCommand } = require('../index');
import assert from 'assert';

describe('Required options without value', function() {
  it('should throw error because no value is set for options that are meant to', function() {
    const args = [
      '/usr/local/bin/node',
      __dirname,
      '--key',
      'http://example.com'
    ];
    const program = parseCommand(args);
    // Values are stored here based on Commander.js
    const objectWithArgs = program.commands[0].parent;
  });
});
