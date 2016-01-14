module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            "src-js": {
                src: [
                    "src/intro.js",
                    "src/core/config.js",
                    "src/core/initialize.js",
                    "src/core/logging.js",
                    "src/core.js",
                    "src/utils.js",
                    "src/shapes/arc.js",
                    "src/shapes/image.js",
                    "src/shapes/line.js",
                    "src/shapes/polygon.js",
                    "src/shapes/rect.js",
                    "src/shapes/sprite.js",
                    "src/shapes/text.js",
                    "src/shapes/index.js",
                    "src/resource.js",
                    "src/export.js",
                    "src/outro.js",
                ],
                dest: "dist/origami.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("build", ["concat"]);

};