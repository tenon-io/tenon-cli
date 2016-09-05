'use strict';

const { parseCommand } = require('../testIndex');
import assert from 'assert';


describe('Valid long form options', function() {
  it('should define each option in ultimate object like it does in arguments with long form flags', function() {
    const args = [
      '/usr/local/bin/node',
      __dirname,
      '--key=XXXXX',
      '--endpoint=http://example.com/api',
      '--in=test.html',
      '--out=testOut.html',
      '--config=testConfig.json',
      '--format=html',
      '--wait-for=3000',
      '--level=AAA',
      '--certainty=80',
      '--importance=40',
      '--priority=20',
      '--store',
      '--doc-id=Jke2kdk3',
      '--fragment=1',
      '--project-id=23A',
      '--user-agent=google-chrome',
      '--view-port-height=100',
      '--view-port-width=300',
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
    assert.equal(objectWithArgs.certainty, 80);
    assert.equal(objectWithArgs.importance, 40);
    assert.equal(objectWithArgs.priority, 20);
    assert.equal(objectWithArgs.store, true);
    assert.equal(objectWithArgs.docId, 'Jke2kdk3');
    assert.equal(objectWithArgs.fragment, 1);
    assert.equal(objectWithArgs.projectId, '23A');
    assert.equal(objectWithArgs.userAgent, 'google-chrome');
    assert.equal(objectWithArgs.viewPortHeight, 100);
    assert.equal(objectWithArgs.viewPortWidth, 300);
  });
});