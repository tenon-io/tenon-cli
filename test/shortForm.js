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
      '--config', 'testConfig.json',
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
    assert.equal(program.key, 'XXXXX');
    assert.equal(program.endpoint, 'http://example.com/api');
    assert.equal(program.in, 'test.html');
    assert.equal(program.out, 'testOut.html');
    assert.equal(program.config, 'testConfig.json');
    assert.equal(program.format, 'html');
    assert.equal(program.waitFor, 3000);
    assert.equal(program.level, 'AAA');
    assert.equal(program.importance, 20);
    assert.equal(program.priority, 20);
    assert.equal(program.store, true);
    assert.equal(program.docId, 'Jke2kdk3');
    assert.equal(program.fragment, 1);
    assert.equal(program.projectId, '23A');
    assert.equal(program.userAgent, 'google-chrome');
    assert.equal(program.viewPortWidth, 100);
    assert.equal(program.viewPortHeight, 300);
  });
});
