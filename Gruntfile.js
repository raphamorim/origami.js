module.exports = function(grunt) {
  function process(code, filepath) {
    return code

    // Embed version
    .replace(/@VERSION/g, grunt.config("pkg").version)

    // Embed date (yyyy-mm-ddThh:mmZ)
    .replace(/@DATE/g, (new Date()).toISOString().replace(/:\d+\.\d+Z$/, "Z"));
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    concat: {
      "src-js": {
        options: {
          process: process
        },
        src: [
          "src/intro.js",
          "src/core/config.js",
          "src/core/initialize.js",
          "src/core/logging.js",
          "src/core.js",
          "src/draw.js",
          "src/utilities.js",
          "src/screen.js",
          "src/shapes/*.js",
          "src/resource.js",
          "src/export.js",
          "src/outro.js",
        ],
        dest: "dist/origami.js"
      }
    },

    uglify: {
      my_target: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/origami.min.js': ['dist/origami.js']
        },
      },
    },

    run: {
      test: {
        cmd: 'npm',
        args: [
          'run',
          'test:only'
        ]
      }
    },

    watch: {
      files: ['src/**/*.js'],
      tasks: ['build'],
      options: {
        spawn: false,
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask("test", ["run:test"]);
  grunt.registerTask("watch:dev", ["watch"]);
  grunt.registerTask("build", ["concat"]);
  grunt.registerTask("default", ["concat", "uglify", "test"]);
};