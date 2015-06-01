module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    app: {
      assets: ''
    },

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
          sourceMap: true,
          outputStyle: 'compressed'
        },
        files: {
          '<%= app.assets %>css/style.min.css': '<%= app.assets %>_css/style.scss'
        }
      }
    },

    autoprefixer: {
      global: {
        src: '<%= app.assets %>css/style.min.css',
        dest: '<%= app.assets %>css/style.min.css'
      }
    },

    concat: {
      js: {
        src: [
          '<%= app.assets %>_js/vendor/**/*.js',
          '<%= app.assets %>_js/*.js'
        ],
        dest: '<%= app.assets %>js/script.js'
      },
      options: {
        separator: ';'
      }
    },

    uglify: {
      js: {
        src: '<%= concat.js.dest %>',
        dest: '<%= app.assets %>js/script.min.js'
      }
    },

    imagemin: {
      assets: {
        files: [{
          expand: true,
          cwd: '<%= app.assets %>_img/',
          src: ['**/*.{svg,svgz,png,jpg,gif}'],
          dest: '<%= app.assets %>img/'
        }],
        options: {
          optimizationLevel: 7
        }
      }
    },

    shell: {
      jekyll_serve: {
        command: "jekyll serve"
      },
      jekyll_build: {
        command: "jekyll build"
      }
    },

    watch: {
      options: {
        livereload: true
      },
      sass: {
        files: ['<%= app.assets %>_css/**/*.scss'],
        tasks: [
          'sass',
          'newer:autoprefixer',
          'shell:jekyll_build'
        ]
      },
      js: {
        files: ['<%= app.assets %>_js/**/*.js'],
        tasks: [
          'newer:concat',
          'newer:uglify',
          'shell:jekyll_build'
        ]
      },
      img: {
        files: ['<%= app.assets %>_img/**/*.{svg,svgz,png,jpg,gif}'],
        tasks: [
          'newer:imagemin',
          'shell:jekyll_build'
        ]
      },
      livereload: {
        files: [
          '*.html',
          '<%= app.assets %>css/style.min.css',
          '<%= app.assets %>js/script.min.js',
          '<%= app.assets %>img/**/*.{svg,svgz,png,jpg,gif}'
        ],
        tasks: ['shell:jekyll_build']
      }
    }
  });

  grunt.registerTask('serve', ['shell:jekyll_serve']);
  grunt.registerTask('default', ['sass', 'newer:autoprefixer', 'newer:concat', 'newer:concurrent:uglify_imagemin', 'shell:jekyll_build', 'watch']);
  grunt.registerTask('update', ['devUpdate']);
};