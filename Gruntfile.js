'use strict';
console.log('grunt is going');
var path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    LIVERELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT }),
    gruntConf = {
      app: 'app',
      dist: 'dist',
      dev: {
        url: 'http://109.74.9.42'
      },
      staging: {
        url: 'http://109.74.9.42'
      },
      build: {
        url: 'https://api.shn.com'
      }
    };
    if (fs.existsSync('config.js')) {
      var localConfig = require('./config.js');
      gruntConf = _.extend(gruntConf, localConfig);
    }

module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var shnConfig = gruntConf;
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: {
      app: 'app',
      dist: 'dist'
    },
    connect: {
      options: {
        port: 9001,
        hostname: 'markuss-macbook-pro.local'
      },
      livereload: {
        options: {
        
          base: shnConfig.app,
          middleware: function(connect, options) {
            return [
              lrSnippet,
              connect.static(path.resolve(options.base))
            ];
          },
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: shnConfig.app,
          dest: shnConfig.dist,
          src: [
            '*.{ico,png,txt}',
            'bootstrap/{,*/}*',
            'js/{,*/}*',
            'css/*',
            'images/{,*/}*.{gif,webp,svg,png,jpg,ico}',
            'fonts/*',
            '*.html',
            'scripts/angular/{,*/}/{,*/}*.html',
          'scripts/angular/{,*/}/*.js'
          ]
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true
      },
      all: [
        'Gruntfile.js',
        shnConfig.app + '/scripts/angular/{,*/}*.js'
      ]
    },
    watch: {

      files: [shnConfig.app+'/scripts/angular/{,*/}/{,*/}*', shnConfig.app+'/scripts/angular/{,*/}*', shnConfig.app+'/scripts/libs/{,*/}*', shnConfig.app + '/*.html', shnConfig.app + '/partials/*'],
      tasks: ['jshint', 'concat', 'string-replace:default'],
      options: {
        force: true,
        nospawn: true,
        livereload: true
      },
      livereload: {
        files: [shnConfig.app+'/scripts/angular/{,*/}*.js', shnConfig.app+'/scripts/libs/{,*/}*', shnConfig.app + '/*.html', shnConfig.app + '/partials/*', shnConfig.app+'/scripts/libs/{angular.pagination/*']
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: shnConfig.app+ '/scripts/angular/{,*/}*.js',
        dest: shnConfig.app +'/js/shn/<%= pkg.name %>.script.js'
      },
      extra: {
        src: shnConfig.app + '/scripts/libs/{,*/}*.js',
        dest: shnConfig.app + '/js/shn/<%= pkg.name %>.libs.js'
      }
    },
    "string-replace": {
      default: {
        files: {
          '<%= config.app %>/js/shn/<%= pkg.name %>.script.js': '<%= config.app %>/js/shn/<%= pkg.name %>.script.js'
        },
        options: {
          replacements: [{
            pattern: /APIURL/ig,
            replacement: shnConfig.dev.url
          }]
        }
      },
      staging: {
        files: {
          '<%= config.app %>/js/shn/<%= pkg.name %>.script.js': '<%= config.app %>/js/shn/<%= pkg.name %>.script.js'
        },
        options: {
          replacements: [{
            pattern: /APIURL/ig,
            replacement: shnConfig.staging.url
          }]
        }
      },
      build: {
        files: {
          '<%= config.app %>/js/shn/<%= pkg.name %>.script.js': '<%= config.app %>/js/shn/<%= pkg.name %>.script.js'
        },
        options: {
          replacements: [{
            pattern: /APIURL/ig,
            replacement: shnConfig.build.url
          }]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        compress: true
      },
      build: {
        src: shnConfig.app +'/scripts/angular/{,*/}*.js',
        dest: shnConfig.app+'/js/shn/<%= pkg.name %>.script.js'
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: shnConfig.app,
          src: ['*.html', 'partials/*.html'],
          dest: shnConfig.dist
        }]
      }
    }
  });

  // Default tasks.
  grunt.registerTask('default', ['connect', 'concat', 'string-replace:default', 'watch' ]);
  grunt.registerTask('staging', ['concat', 'string-replace:staging',  'copy' ]);
  grunt.registerTask('build', ['concat', 'string-replace:build', 'copy' ]);
};
