'use strict';

const { parseCommand } = require('../testIndex');
import assert from 'assert';

describe('Valid short form options', function() {
  it('should define each option in ultimate object like it does in arguments with short form flags', function() {
    const args = [
      '/usr/local/bin/node',
      __dirname,
      '-k', 'XXXXX',
      '-e', 'http://example.com/api',
      '-i', 'test.html',
      '-o', 'testOut.html',
      '-C', 'testConfig.json',
      '-f', 'html',
      '-w', '3000',
      '-l', 'AAA',
      '-I', '20',
      '-p', '20',
      '-s',
      '-d', 'Jke2kdk3',
      '-F', '1',
      '-P', '23A',
      '-u', 'google-chrome',
      '-W', '100',
      '-H', '300',
      'http://example.com'
    ];
    const program = parseCommand(args);
    // Values are stored here based on Commander.js
    const objectWithArgs = program.commands[0].parent;
    assert.equal(objectWithArgs.key, 'XXXXX');
    assert.equal(objectWithArgs.endpoint, 'http://example.com/api');
    assert.equal(objectWithArgs.in, 'test.html');
    assert.equal(objectWithArgs.out, 'testOut.html');
    assert.equal(objectWithArgs.config, 'testConfig.json');
    assert.equal(objectWithArgs.format, 'html');
    assert.equal(objectWithArgs.waitFor, 3000);
    assert.equal(objectWithArgs.level, 'AAA');
    assert.equal(objectWithArgs.importance, 20);
    assert.equal(objectWithArgs.priority, 20);
    assert.equal(objectWithArgs.store, true);
    assert.equal(objectWithArgs.docId, 'Jke2kdk3');
    assert.equal(objectWithArgs.fragment, 1);
    assert.equal(objectWithArgs.projectId, '23A');
    assert.equal(objectWithArgs.userAgent, 'google-chrome');
    assert.equal(objectWithArgs.viewPortWidth, 100);
    assert.equal(objectWithArgs.viewPortHeight, 300);
  });
});
