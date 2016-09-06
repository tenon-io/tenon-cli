#!/usr/bin/env node

import fs from 'fs';
import tenonNode from 'tenon-node';
import reporters from 'tenon-reporters';
import getStdin from 'get-stdin';
import { parseCommand } from './';

// This line takes any piped HTML that will be sent to Tenon
getStdin().then(pipedHTML => {
  // Call the module that holds the Commander.js logic for CLI options and commands
  const program = parseCommand(process.argv);
  // Check if there are more than 1 non-option arguments
  // If there are, there are too many and the URL to test cannot be found
  if (program.commands[0].args.length > 1) {
    console.error('You have supplied too many arguments, for help type \'tenon --help\'');
    process.exit(1);
  }

  // This finds the URL command, which should be the only non-option argument
  const command = program.commands[0].args[0];

  // Load the config file for options if it exists
  let configuration = {};
  if (program.commands[0].config) {
    try {
      configuration = fs.readFileSync(program.commands[0].config, 'utf8');
      configuration = JSON.parse(configuration);
    } catch (e) {
      // The json could not be parsed or read
      console.error('Failed to parse or read configuration file...');
      console.error(e.message);
      process.exit(1);
    }
  }

  // Merge the two sources of options
  const allOptions = Object.assign({},
    configuration,
    program.commands[0]
  );

  // Options that can be sent to Tenon
  const tenonOptions = {
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
    viewPortWidth: 'viewPortWidth',
  };

  const options = {};
  // Generate the array of options for Tenon
  Object.keys(tenonOptions).forEach((key) => {
    const value = tenonOptions[key];
    if (allOptions[key]) {
      if (key === 'store' || key === 'fragment') {
        allOptions[key] = +allOptions[key];
      }
      options[value] = allOptions[key];
    }
  });

  // Delete all of the options that haven't been set
  Object.keys(options).forEach((key) => {
    if (options[key] === undefined) {
      delete options[key];
    }
  });

  // Defaults
  if (!options['format']) {
    options['format'] = "json";
  }

  // Check and make sure all of the required fields have been entered
  const requiredFields = ['key'];
  requiredFields.forEach((field) => {
    if (!allOptions[field]) {
      console.log('\'' + field + '\' is required');
      process.exit(1);
    }
  });

  // Now we determine what is getting analyzed (input file, stdin, or url)
  // url > stdin > file
  let source;
  if (command) {
    source = command;
  } else if (pipedHTML) {
    source = pipedHTML;
  } else if (allOptions.in) {
    try {
      source = fs.readFileSync(allOptions.in, 'utf8');
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
  const tenonApi = new tenonNode({
    key: allOptions.key,
    endPoint: allOptions.endpoint, // or your private tenon instance
  });

  const writeResultFile = (result, file) => {
    try {
      fs.writeFileSync(file, result);
      console.log(`Analysis complete, report at ${file}`);
    } catch (e) {
      console.error('Failed to write file...');
      console.error(e.message);
      process.exit(1);
    }
  };

  const parseFormat = (json) => {
    switch (allOptions.format) {
      case 'json':
        // Tenon returns resuls in JSON, so it's already formatted correctly
        return new Promise((resolve, reject) => {
          resolve(JSON.stringify(json, null, '\t'));
        });
      case 'csv':
        return new Promise((resolve) => {
          reporters.CSV(json, (err, result) => {
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
        return new Promise((resolve) => {
          reporters.HTML(json, (err, result) => {
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
        return new Promise((resolve) => {
          reporters.XUnit(json, (err, result) => {
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

  tenonApi.analyze(source, options, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      if (result.status >= 400) {
        console.error('Tenon reported an error:');
        console.error(JSON.stringify(result, null, '\t'));
        process.exit(1);
      }

      console.log('Tenon analysis completed.');
      parseFormat(result).then((formattedResult) => {
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

