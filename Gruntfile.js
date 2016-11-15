'use strict';

module.exports = function (grunt) {
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time at the end
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['Gruntfile.js']
            }
        },
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
