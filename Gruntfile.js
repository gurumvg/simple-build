var path = require('path');

module.exports = function(grunt) {

    var BLDCFG = grunt.file.readJSON('build.json'), //TODO Redundant reference
        doConcat = BLDCFG.concat;


    // -- Config -------------------------------------------------------------------

    grunt.initConfig({

        // -- Reading configuration ------------------------------------------------

        PKG: grunt.file.readJSON('package.json'),

        BLDCFG: grunt.file.readJSON('build.json'),

        // -- Constants ------------------------------------------------------------

        BUILD_COMMENT: '/*! <%= PKG.name %> - v<%= PKG.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',


        // -- Clean Config ---------------------------------------------------------

        clean: {
            pre: ['<%= BLDCFG.destination %>/']
        },

        // -- Concat Config ----------------------------------------------------------
        concat: {
            options: {
                stripBanners: true,
                banner: '<%= BUILD_COMMENT %>'
            },
            scripts: {
                expand: true,
                cwd: '<%= BLDCFG.source %>/scripts/',
                src: ['**/*.js'],
                dest: '<%= BLDCFG.destination %>/scripts/'
            },
            styles: {
                expand: true,
                cwd: '<%= BLDCFG.source %>/styles/',
                src: ['**/*.css'],
                dest: '<%= BLDCFG.destination %>/styles/'
            }
        },

        // -- Copy Config ----------------------------------------------------------

        copy: {
            main: {
                expand: true,
                cwd: '<%= BLDCFG.source %>/',
                src: ['**/*.{js,css}'],
                dest: '<%= BLDCFG.destination %>/'
            }
        },


        // -- Lint Config --------------------------------------------------------

        jshint: {
            force: true,
            main: {
                src: ['<%= BLDCFG.source %>/**/*.js']
            }
        },

        csslint: {
            main: {
                src: ['<%= BLDCFG.source %>/**/*.css']
            }
        },



        // -- CSSMin Config --------------------------------------------------------

        cssmin: {
            options: {
                banner: '<%= BUILD_COMMENT %>'
            },
            main: {
                files: [{
                    expand: true,
                    cwd: '<%= BLDCFG.source %>/',
                    src: ['**/*.css'],
                    ext: '-min.css',
                    dest: '<%= BLDCFG.destination %>/'
            }]
            }
        },

        // -- JSUglify(Min) Config --------------------------------------------------------

        uglify: {
            options: {
                banner: '<%= BUILD_COMMENT %>'
            },
            main: {
                files: [{
                    expand: true,
                    cwd: '<%= BLDCFG.source %>/',
                    src: ['**/*.js'],
                    ext: '-min.js',
                    dest: '<%= BLDCFG.destination %>/'
            }]
            }

        },

        // -- Watch/Observe Config -------------------------------------------------

        observe: {
            options: {
                interrupt: true
            },

            styles: {
                files: '<%= jsfiles_src %>',
                tasks: ['copy:styles', 'cssmin']
            },

            scripts: {
                files: '<%= cssfiles_src %>',
                tasks: ['copy:scripts', 'uglify']
            }
        }
    });

    // -- Main Tasks ---------------------------------------------------------------
    debugger;
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');


    var tasks = ['clean', 'copy'];

    if (BLDCFG.concat) {
        grunt.loadNpmTasks('grunt-contrib-concat');
        tasks.push("concat");
    }

    if (BLDCFG.lintify) {
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-csslint');
        tasks.push("jshint");
        tasks.push("csshint");
    }

    if (BLDCFG.minify) {
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        tasks.push("uglify");
        tasks.push("cssmin");
    }



    grunt.registerTask('default', tasks);


    // Makes the `watch` task run a build first.
    /*grunt.renameTask('watch', 'observe');
    grunt.registerTask('watch', ['default', 'observe']);

    //on watch events configure jshint:all to only run on changed file
    grunt.event.on('watch', function(action, filepath) {
        grunt.log.writeln('\n' + filepath + ' has ' + action);

        grunt.config(['copy', 'scripts', 'files', 'src'], filepath);
    });*/
};