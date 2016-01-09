module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            "src-js": {
                src: [
                    "src/intro.js",
                    "src/export.js",
                    "src/outro.js",
                ],
                dest: "dist/origami.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask("build", ["concat"]);

};