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

  // Defaults, can't do this in index.js because of the config.js file
  // There is no way to differentiate between default and user entered which is the problem
  var defaults = {
    "endpoint": 'https://tenon.io/api/',
    "format": 'json'
  };

  Object.keys(defaults).forEach(function (key) {
    if (!allOptions[key]) {
      allOptions[key] = defaults[key];
    }
  });

  if (process.env.TENON_API_KEY && !allOptions.key) {
    allOptions.key = process.env.TENON_API_KEY;
  }

  // Options that can be sent to Tenon
  var tenonOptions = {
    waitFor: 'waitFor',
    level: 'level',
    certainty: 'certainty',
    importance: 'importance',
    priority: 'priority',
    store: 'store',
    docId: 'docID',
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
      if (key === 'store' || key === 'fragment') {
        allOptions[key] = +allOptions[key];
      }
      options[value] = allOptions[key];
    }
  });

  // Delete all of the options that haven't been set
  Object.keys(options).forEach(function (key) {
    if (options[key] === undefined) {
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
      console.log('Analysis complete, report at ' + file);
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
        return new Promise(function (resolve, reject) {
          resolve(JSON.stringify(json, null, '\t'));
        });
      case 'csv':
        return new Promise(function (resolve) {
          _tenonReporters2.default.CSV(json, function (err, result) {
            if (err) {
              console.error('Failed to parse Tenon response into CSV format');
              console.error(err);
              process.exit(1);
            } else {
              resolve(result);
            }
          });
        });
      case 'html':
        return new Promise(function (resolve) {
          _tenonReporters2.default.HTML(json, function (err, result) {
            if (err) {
              console.error('Failed to parse Tenon response into HTML format');
              console.error(err);
              process.exit(1);
            } else {
              resolve(result);
            }
          });
        });
      case 'xunit':
        return new Promise(function (resolve) {
          _tenonReporters2.default.XUnit(json, function (err, result) {
            if (err) {
              console.error('Failed to parse Tenon response into XUnit format');
              console.error(err);
              process.exit(1);
            } else {
              resolve(result);
            }
          });
        });
      default:
        console.error('Error occured, format not found');
        process.exit(1);
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
      parseFormat(result).then(function (formattedResult) {
        if (allOptions.out) {
          console.log('Writing results to file...');
          try {
            writeResultFile(formattedResult, allOptions.out);
          } catch (e) {
            console.error('Failed to write result to file...');
            console.error(e.message);
            process.exit(1);
          }
        } else {
          console.log('Writing results to console...');
          process.stdout.write(formattedResult);
        }
      });
    }
  });
});