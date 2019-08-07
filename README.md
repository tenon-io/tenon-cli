[![Build Status](https://travis-ci.org/tenon-io/tenon-cli.svg?branch=master)](https://travis-ci.org/tenon-io/tenon-cli) [![Code Climate](https://codeclimate.com/github/tenon-io/tenon-cli/badges/gpa.svg)](https://codeclimate.com/github/tenon-io/tenon-cli)

[![NPM](https://nodei.co/npm/tenon-cli.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/tenon-cli/)
# Tenon CLI

This CLI was made to interact with the Tenon.io API. It utilizes Node and Commander,js to create a UNIX-style CLI.

### Installation

Tenon CLI requires [Node.js](https://nodejs.org/) v4+ to run.

Install it as global package:

```sh
$ npm install tenon-cli -g
```

### Usage

First, register at [https://tenon.io](https://tenon.io) and acquire the API key.

Basic usage:

```sh
$ tenon-cli --key=XXXXXXXX https://example.com
```

This will return JSON formatted test results for the given URL.

If you need more control, you can supply a config.json file and supply it like this:

```sh
$ tenon-cli --key=XXXXXXXX --config=config.json https://example.com
```

A sample config file:

```json
{
  "out": "test-results.html",
  "format": "html",
  "waitFor": 1000
}
```

You can supply the results file, format you require and various other parameters.

You can find all the available formats in https://github.com/poorgeek/tenon-reporters readme.


### Development

To develop this CLI further, modify the following files:

`tenon.js` - This is where the Tenon API is called and where the options included in these calls and used to manage the return data exists.

`index.js` - This is where the actual CommanderJS parser and all of the CLI specific data exists.

*NOTE: ANY CHANGES MADE TO OPTIONS IN `index.js` MUST BE REFLECTED IN `testIndex.js` BECAUSE THEIR ENVIRONMENTS ARE SLIGHTLY DIFFERENT BUT THE TEST FILE MUST ACCURATELY MOCK THE PRODUCTION INDEX FILE IN ORDER FOR TESTING TO BE EFFECTIVE.*

Then run
```sh
$ npm run compile
```

Then when you are ready to run it as a full blown CLI, run this from the root directory of the project:
```sh
$ npm install -g
```

(optional) Third:
```sh
$ karma start
```

#### Testing

Tests automatically utilize babel and ES6 standards, to run tests just enter (from the project root directory):
```
$ npm run test
```
This will run the tests using mocha.

To write new tests, just put them in the `test/` folder and they will automatically be tested with the above command. Each test that utilizes/mocks the CLI arguments and their conversion to options must import/require `testIndex.js`.
