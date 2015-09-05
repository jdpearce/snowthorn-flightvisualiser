module.exports = function(grunt) {

    grunt.config('watch', {
        build: {
            options: {
                livereload : true,
            },
            files: ['src/**', 'tasks/**'],
            tasks: ['rebuild']
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
};