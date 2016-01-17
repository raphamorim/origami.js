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
                    "src/setter.js",
                    "src/utils.js",
                    "src/shapes/arc.js",
                    "src/shapes/image.js",
                    "src/shapes/line.js",
                    "src/shapes/polygon.js",
                    "src/shapes/rect.js",
                    "src/shapes/sprite.js",
                    "src/shapes/text.js",
                    "src/shapes/shape.js",
                    "src/shapes/index.js",
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
                    'dist/origami.min.js': ['dist/origami.js'],
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask("pre-build", ["concat"]);
    grunt.registerTask("build", ["concat", "uglify"]);

};