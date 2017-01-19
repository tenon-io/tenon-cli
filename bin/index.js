#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCommand = undefined;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseCommand = exports.parseCommand = function parseCommand(passedArguments) {
  _commander2.default.command('*').description('A CLI for the Tenon Node').option('-k, --key <key>', 'Tenode API key').option('-e, --endpoint <endpoint>', 'Tenon API endpoint').option('-i, --in [in]', 'Input file').option('-o, --out <out>', 'Output file').option('--config [config]', 'Tenode configuration file').option('-f, --format [format]', 'The format of the outputted data [json, html, xunit, csv]', /^(json|html|xunit|csv)$/i).option('-w, --wait-for [waitFor]', 'Delay, in milliseconds, for the Tenode tests', parseFloat).option('-l, --level [level]', 'The "lowest" WCAG level to test against', /^(A|AA|AAA)$/i).option('-c, --certainty [certainty]', 'Level of certainty of Tenode results [0, 20, 40, 60, 80, 100]', /^(0|20|40|60|80|100)$/i).option('-I, --importance [importance]', 'An optional value').option('-p, --priority [priority]', 'Filter for Tenode results, filtering out those with a lower priortiy', /^(0|20|40|60|80|100)$/i).option('-s, --store', 'Should Tenode store the results or not?').option('-d, --doc-id [docID]', 'A string of text used to identify the page being tested').option('-F, --fragment', 'This parameter allows you to identify the source string as only a fragment of a page').option('-P, --project-id [projectID]', 'A string you can supply to identify the tested document as part of a specific system').option('-u, --user-agent [uaString]', 'A user-agent to be supplied during Tenode tests').option('-H, --view-port-height [viewPortHeight]', 'The height of the headless browser viewport in Tenode tests', parseFloat).option('-W, --view-port-width [viewPortWidth]', 'The width of the headless browser viewport in Tenode tests', parseFloat).action(function (env) {
    // The 'source of truth' options object combining program and file configs, giving program priority
    command = env;
  }).parse(passedArguments);

  return _commander2.default;
};