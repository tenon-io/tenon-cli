'use strict';

// Load all grunt tasks
require('load-grunt-tasks')(grunt);
// Show elapsed time at the end
require('time-grunt')(grunt);

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        /* Run JSONLint on our configuration files */
        jsonlint: {
            configFiles: {
                src: ['package.json', '.babelrc', '.jshintrc', 'config.json']
            }
        }

    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'travis-lint', 'jsonlint']);
};
