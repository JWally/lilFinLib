module.exports = function (grunt) {
    grunt.initConfig({
        "jshint": {
            "files": [
                "src/**/*.js",
                "!src/bower_components/**",
                "!src/template/all.js",
                "!src/app.build.js",
                "!src/main.min.js",
                "!src/modules/stripe.js",
                "!src/modules/d3.js"
            ],
            "options": {
                "quotmark": "double",
                "camelcase": false,
                "curly": true,
                "eqeqeq": true,
                "indent": 4,
                "newcap": true,
                "noempty": true,
                "nonew": true,
                "trailing": true,
                "maxlen": 100,
                "white": true
            }
        },
        "mochaTest": {
            "test": {
                "options": {
                    "reporter": "spec",
                    "ui": "tdd"
                },
                "src": ["test/**/*.js"]
            }
        },
        "jsbeautifier": {
            "default": {
                src: [
                    "gruntfile.js",
                    "src/**/*.js",
                    "src/**/*.html",
                    "src/**/*.scss",
                    "!src/js/template/all.js",
                    "!src/modules/d3.js",
                    "!src/modules/stripe.js"

                ]
            },
            "options": {
                "html": {
                    "brace_style": "collapse",
                    "indent_char": " ",
                    "indent_scripts": "keep",
                    "indent_size": 4,
                    "max_preserve_newlines": 10,
                    "preserve_newlines": true,
                    "unformatted": ["a", "sub", "sup", "b", "i",
                        "u"
                    ],
                    "wrap_line_length": 0
                },
                "js": {
                    "brace_style": "collapse",
                    "break_chained_methods": false,
                    "e4x": false,
                    "eval_code": false,
                    "indent_char": " ",
                    "indent_level": 0,
                    "indent_size": 4,
                    "indent_with_tabs": false,
                    "jslint_happy": true,
                    "keep_array_indentation": false,
                    "keep_function_indentation": false,
                    "max_preserve_newlines": 10,
                    "preserve_newlines": true,
                    "space_before_conditional": true,
                    "space_in_paren": false,
                    "unescape_strings": false,
                    "wrap_line_length": 90
                },
                "css": {
                    "fileTypes": [".scss"],
                    "indentChar": " ",
                    "indentSize": 4
                }
            }
        }





    });

    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.registerTask("test", ["jsbeautifier:default", "jshint", "mochaTest"]);

    grunt.registerTask("prod", [
        "jsbeautifier:default",
        "jshint"
    ]);

    grunt.registerTask("dev", [
        "jsbeautifier:default",
        "jshint"
    ]);




}
