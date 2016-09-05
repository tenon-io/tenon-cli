#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tenonNode = require('tenon-node');

var _tenonNode2 = _interopRequireDefault(_tenonNode);

var _tenonReporters = require('tenon-reporters');

var _tenonReporters2 = _interopRequireDefault(_tenonReporters);

var _getStdin = require('get-stdin');

var _getStdin2 = _interopRequireDefault(_getStdin);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This line takes any piped HTML that will be sent to Tenon
(0, _getStdin2.default)().then(function (pipedHTML) {
  // Call the module that holds the Commander.js logic for CLI options and commands
  var program = (0, _.parseCommand)(process.argv);
  // Check if there are more than 1 non-option arguments
  // If there are, there are too many and the URL to test cannot be found
  if (program.commands[0].args.length > 1) {
    console.error('You have supplied too many arguments, for help type \'tenon --help\'');
    process.exit(1);
  }

  // This finds the URL command, which should be the only non-option argument
  var command = program.commands[0].args[0];

  // Load the config file for options if it exists
  var configuration = {};
  if (program.commands[0].config) {
    try {
      configuration = _fs2.default.readFileSync(program.commands[0].config, 'utf8');
      configuration = JSON.parse(configuration);
    } catch (e) {
      // The json could not be parsed or read
      console.error('Failed to parse or read configuration file...');
      console.error(e.message);
      process.exit(1);
    }
  }

  // Merge the two sources of options
  var allOptions = Object.assign({}, configuration, program.commands[0]);

  // Options that can be sent to Tenon
  var tenonOptions = {
    waitFor: 'waitFor',
    level: 'level',
    certainty: 'certainty',
    importance: 'importance',
    priority: 'priority',
    store: 'store',
    docID: 'docID',
    fragment: 'fragment',
    projectId: 'projectID',
    userAgent: 'UAString',
    viewPortHeight: 'viewPortHeight',
    viewPortWidth: 'viewPortWidth'
  };

  var options = {};
  // Generate the array of options for Tenon
  Object.keys(tenonOptions).forEach(function (key) {
    var value = tenonOptions[key];
    if (allOptions[key]) {
      var mappedIndex = value;
      options[mappedIndex] = allOptions[key];
    }
  });

  // Delete all of the options that haven't been set
  Object.keys(options).forEach(function (key) {
    if (!options[key]) {
      delete options[key];
    }
  });

  // Check and make sure all of the required fields have been entered
  var requiredFields = ['key'];
  requiredFields.forEach(function (field) {
    if (!allOptions[field]) {
      console.log('\'' + field + '\' is required');
      process.exit(1);
    }
  });

  // Now we determine what is getting analyzed (input file, stdin, or url)
  // url > stdin > file
  var source = void 0;
  if (command) {
    source = command;
  } else if (pipedHTML) {
    source = pipedHTML;
  } else if (allOptions.in) {
    try {
      source = _fs2.default.readFileSync(allOptions.in, 'utf8');
    } catch (e) {
      // Failed to read input file
      console.error('Failed to read input file, ' + allOptions.in);
      process.exit(1);
    }
  } else {
    // No URL, stdin or file specified
    console.error('No input HTML specified for analysis');
    process.exit(1);
  }

  // Initialize the Tenon API object
  var tenonApi = new _tenonNode2.default({
    key: allOptions.key,
    endPoint: allOptions.endpoint });

  var writeResultFile = function writeResultFile(result, file) {
    try {
      _fs2.default.writeFileSync(file, result);
      console.log('Analysis complete, report at ${file}');
    } catch (e) {
      console.error('Failed to write file...');
      console.error(e.message);
      process.exit(1);
    }
  };

  var parseFormat = function parseFormat(json) {
    switch (allOptions.format) {
      case 'json':
        // Tenon returns resuls in JSON, so it's already formatted correctly
        writeResultFile(JSON.stringify(json, null, '\t'), '${allOptions.out}.json');
        break;
      case 'csv':
        _tenonReporters2.default.CSV(json, function (err, result) {
          if (err) {
            console.error('Failed to parse Tenon response into CSV format');
            console.error(err);
          } else {
            writeResultFile(result, '${allOptions.out}.csv');
          }
        });
        break;
      case 'html':
        _tenonReporters2.default.HTML(json, function (err, result) {
          if (err) {
            console.error('Failed to parse Tenon response into HTML format');
            console.error(err);
          } else {
            writeResultFile(result, '${allOptions.out}.html');
          }
        });
        break;
      case 'xunit':
        _tenonReporters2.default.XUnit(json, function (err, result) {
          if (err) {
            console.error('Failed to parse Tenon response into XUnit format');
            console.error(err);
          } else {
            writeResultFile(result, '${allOptions.out}.xml');
          }
        });
        break;
      default:
        console.error('Error occured, format not found');
        break;
    }
  };

  // Call the Tenon API for analysis
  console.log('Sending request to Tenon...');

  tenonApi.analyze(source, options, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      if (result.status >= 400) {
        console.error('Tenon reported an error:');
        console.error(JSON.stringify(result, null, '\t'));
        process.exit(1);
      }
      console.log('Tenon analysis completed.');
      if (allOptions.out) {
        console.log('Writing results to file...');
        parseFormat(result);
      } else {
        console.log('Writing results to console...');
        process.stdout.write(JSON.stringify(result, null, '\t'));
        process.stdout.write('\n');
      }
    }
  });
});