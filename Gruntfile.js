module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: "\n",
                stripBanners: true
            },
            basic: {
                src: ['src/svm/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
            nodePacker: {
                src: ['dist/<%= pkg.name %>.js','src/nodePacker.js'],
                dest: 'dist/<%= pkg.name %>.packed.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                compress: true,
                report: 'gzip',
                /*mangle: {
                 except: ['SVM', '_']
                 }*/
                mangle: false
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.nodePacker.dest %>']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat', 'uglify']);

};