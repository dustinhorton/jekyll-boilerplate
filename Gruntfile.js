module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    assets: '',
    imgTypes: 'svg,svgz,png,jpg,gif',

    concurrent: {
      uglifyImagemin: [
        'uglify',
        'imagemin'
      ]
    },

    sass: {
      dist: {
        options: {
          outputStyle: 'expanded',
          sourceMap: true
        },
        files: {
          '<%= assets %>css/style.css': '<%= assets %>_css/style.scss'
        }
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions, Explorer >= 10'}),
          require('postcss-focus')(),
          require('cssnano')()
        ]
      },
      dist: {
        src: '<%= assets %>css/style.css',
        dest: '<%= assets %>css/style.min.css'
      }
    },

    concat: {
      dist: {
        src: [
          '<%= assets %>_js/vendor/**/*.js',
          '<%= assets %>_js/*.js',
          '!<%= assets %>_js/vendor/modernizr.js'
        ],
        dest: '<%= assets %>js/.tmp/script.js'
      },
      options: {
        separator: ';'
      }
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          '<%= assets %>js/script.js': '<%= assets %>js/.tmp/script.js'
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true
      },
      dist: {
        src: '<%= assets %>js/script.js',
        dest: '<%= assets %>js/script.min.js'
      }
    },

    modernizr: {
      dist: {
        devFile: '<%= assets %>_js/vendor/modernizr.js',
        outputFile: '<%= assets %>js/vendor/modernizr.js'
      }
    },

    //sprite: {
    //  dist: {
    //    src: '<%= assets %>_img/sprite/**/*.png',
    //    dest: '<%= assets %>_img/sprite.png',
    //    destCss: '<%= assets %>_css/_sprite.scss',
    //    padding: 2
    //  }
    //},

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= assets %>_img/',
          src: ['**/*.{<%= imgTypes %>}'],
          dest: '<%= assets %>img/'
        }],
        options: {
          optimizationLevel: 7
        }
      }
    },

    shell: {
      jekyllServe: {
        command: 'jekyll serve'
      },
      jekyllBuild: {
        command: 'jekyll build'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      sass: {
        files: ['<%= assets %>_css/**/*.scss'],
        tasks: [
          'sass',
          'newer:postcss',
          'shell:jekyllBuild'
        ]
      },
      js: {
        files: ['<%= assets %>_js/**/*.js'],
        tasks: [
          'newer:concat',
          'newer:uglify',
          'shell:jekyllBuild'
        ]
      },
      img: {
        files: ['<%= assets %>_img/**/*.{<%= imgTypes %>}'],
        tasks: [
          'newer:imagemin',
          'shell:jekyllBuild'
        ]
      },
      //imgSprite: {
      //  files: ['<%= assets %>_img/sprite/**/*.png'],
      //  tasks: [
      //    'sprite',
      //    'shell:jekyllBuild'
      //  ]
      //},
      livereload: {
        files: [
          '**/*.html',
          '<%= assets %>css/style.min.css',
          '<%= assets %>js/script.min.js',
          '<%= assets %>img/**/*.{<%= imgTypes %>}'
        ],
        tasks: ['shell:jekyllBuild']
      }
    },

    devUpdate: {
      main: {
        options: {
          updateType: 'force',
          semver: false
        }
      }
    }
  });

  grunt.registerTask('serve', ['shell:jekyllServe']);
  grunt.registerTask('default', [
    'newer:sass',
    'newer:postcss',
    'newer:babel',
    'newer:concat',
    //'newer:sprite',
    'newer:concurrent:uglifyImagemin',
    'shell:jekyllBuild'
  ]);
  grunt.registerTask('start', [
    'default',
    'watch'
  ]);
  grunt.registerTask('update', ['devUpdate']);
};