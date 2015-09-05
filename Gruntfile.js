module.exports = function (grunt) {

  // Configuration
  grunt.initConfig({
    pkg: require('./package.json'),
    app: 'src',
    dist: '_dist',
    bower: grunt.file.readJSON('./.bowerrc')
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('rebuild', ['clean', 'copy', 'uglify']);

  grunt.registerTask('default', ['rebuild', 'connect', 'watch']);
};