module.exports = function( grunt ) {

    grunt.initConfig( {

        // Import package manifest
        pkg: grunt.file.readJSON( "package.json" ),

        // Banner definitions
        meta: {
            banner: "/*\n" +
                " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                " *  <%= pkg.description %>\n" +
                " *  <%= pkg.homepage %>\n" +
                " *\n" +
                " *  Written by <%= pkg.author.name %> (<%= pkg.author.email %>)\n" +
                " *  Under <%= pkg.license %> License\n" +
                " *  SDG\n" +
                " */\n",
            banner_short: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> | <%= pkg.homepage %> | (c) <%= pkg.author.email %> */\n"
        },

        // Concat definitions
        concat: {
            options: {
                banner: "<%= meta.banner %>"
            },
            dist: {
                src: [ "src/jquery.smartOn.js" ],
                dest: "dist/jquery.smartOn.js"
            },
        },

        // Lint definitions
        jshint: {
            files: [ "src/jquery.smartOn.js", "test/**/*" ],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        jscs: {
            src: "src/**/*.js",
            options: {
                config: ".jscsrc"
            }
        },

        // Minify definitions
        uglify: {
            dist: {
                expand: true,
                cwd: 'dist/',
                src: [
                    '**/*.js',
                    '!**/*.min.js'
                ],
                dest: 'dist/',
                ext:    '.min.js',
                extDot: 'last',
            },
            options: {
                banner: "<%= meta.banner_short %>"
            }
        },

        copy: {
            main: {
                expand: true,
                cwd: 'node_modules/jquery/dist/',
                src: 'jquery.min.js',
                dest: 'src/',
            }
        },

        // karma test runner
        karma: {
            unit: {
                configFile: "karma.conf.js",
                background: true,
                singleRun: false,
                browsers: [
                    "PhantomJS",
                    // "Firefox"
                ]
            },

            //continuous integration mode: run tests once in PhantomJS browser.
            travis: {
                configFile: "karma.conf.js",
                singleRun: true,
                browsers: [ "PhantomJS" ]
            }
        },

        // watch for changes to source
        // Better than calling grunt a million times
        // (call 'grunt watch')
        watch: {
            options: {
                atBegin: true
            },
            files: [ "src/**/*", "test/**/*", "gruntfile.js" ],
            tasks: [ "default" ]
        }

    } );

    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-jscs" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
//    grunt.loadNpmTasks( "grunt-contrib-coffee" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-karma" );
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask( "travis", [ "jshint", "karma:travis" ] );
    grunt.registerTask( "lint", [ "jshint", "jscs" ] );
    grunt.registerTask( "build", [ "copy", "concat", "uglify" ] );
    grunt.registerTask( "default-watch", [ "jshint", "build", "karma:unit:run" ] );
    grunt.registerTask( "w", [ "karma:unit:start", "watch" ] );
    grunt.registerTask( "default", [ "jshint", "build", "karma:unit" ] );
};
