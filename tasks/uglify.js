module.exports = function(grunt) {

  grunt.config('uglify', {
      options: {
      banner: '/*! <%= pkg.name %> lib - v<%= pkg.version %> -' +
              '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        files: {
          '<%= dist %>/js/lib.min.js': [
            '<%= bower.directory %>/jquery/dist/jquery.min.js',
            '<%= bower.directory %>/bootstrap/dist/js/bootstrap.min.js',
            '<%= app %>/js/*.js'
          ]
        }
      }
    });
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
};