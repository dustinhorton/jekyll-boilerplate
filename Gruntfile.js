module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    assets: '',
    img_types: 'svg,svgz,png,jpg,gif',

    devUpdate: {
      main: {
        options: {
          updateType: 'force',
          semver: false
        }
      }
    },

    concurrent: {
      uglify_imagemin: ['uglify', 'imagemin']
    },

    sass: {
      dist: {
        options: {
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
          require('autoprefixer-core')({browsers: 'last 2 versions, Explorer >= 8'}),
          require('postcss-color-rgba-fallback')(),
          require('postcss-focus')(),
          require('postcss-opacity')(),
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
        dest: '<%= assets %>js/script.js'
      },
      options: {
        separator: ';'
      }
    },

    uglify: {
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: '<%= assets %>js/script.min.js'
      }
    },

    modernizr: {
      dist: {
        devFile: '<%= assets %>_js/vendor/modernizr.js',
        outputFile: '<%= assets %>js/vendor/modernizr.js',
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
          src: ['**/*.{<%= img_types %>}'],
          dest: '<%= assets %>img/'
        }],
        options: {
          optimizationLevel: 7
        }
      }
    },

    shell: {
      jekyll_serve: {
        command: 'jekyll serve'
      },
      jekyll_build: {
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
          'shell:jekyll_build'
        ]
      },
      js: {
        files: ['<%= assets %>_js/**/*.js'],
        tasks: [
          'newer:concat',
          'newer:uglify',
          'shell:jekyll_build'
        ]
      },
      img: {
        files: ['<%= assets %>_img/**/*.{<%= img_types %>}'],
        tasks: [
          'newer:imagemin',
          'shell:jekyll_build'
        ]
      },
      //img_sprite: {
      //  files: ['<%= assets %>_img/sprite/**/*.png'],
      //  tasks: [
      //    'sprite',
      //    'shell:jekyll_build'
      //  ]
      //},
      livereload: {
        files: [
          '**/*.html',
          '<%= assets %>css/style.min.css',
          '<%= assets %>js/script.min.js',
          '<%= assets %>img/**/*.{<%= img_types %>}'
        ],
        tasks: ['shell:jekyll_build']
      }
    }
  });

  grunt.registerTask('serve', ['shell:jekyll_serve']);
  //grunt.registerTask('default', ['newer:sass', 'newer:postcss', 'newer:concat', 'newer:sprite', 'newer:concurrent:uglify_imagemin', 'shell:jekyll_build', 'watch']);
  grunt.registerTask('default', ['newer:sass', 'newer:postcss', 'newer:concat', 'newer:concurrent:uglify_imagemin', 'shell:jekyll_build', 'watch']);
  grunt.registerTask('update', ['devUpdate']);
};