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

    assert.equal(program.key, 'XXXXX');
    assert.equal(program.endpoint, 'http://example.com/api');
    assert.equal(program.in, 'test.html');
    assert.equal(program.out, 'testOut.html');
    assert.equal(program.config, 'testConfig.json');
    assert.equal(program.format, 'html');
    assert.equal(program.waitFor, 3000);
    assert.equal(program.level, 'AAA');
    assert.equal(program.certainty, 80);
    assert.equal(program.importance, 40);
    assert.equal(program.priority, 20);
    assert.equal(program.store, true);
    assert.equal(program.docId, 'Jke2kdk3');
    assert.equal(program.fragment, 1);
    assert.equal(program.projectId, '23A');
    assert.equal(program.userAgent, 'google-chrome');
    assert.equal(program.viewPortHeight, 100);
    assert.equal(program.viewPortWidth, 300);
  });
});
