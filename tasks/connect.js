module.exports = function(grunt) {

    grunt.config('connect', {
        server: {
            options: {
                port : 58883,
                protocol: 'http',
                base: '<%= dist %>'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-connect');
};