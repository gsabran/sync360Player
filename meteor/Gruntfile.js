module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  var config = {
    pkg: grunt.file.readJSON('package.json'),
    replace: {
      prod: { // replace string patterns
        src: [
          './client/lib/socketManager.js',
        ],
        overwrite: true,
        replacements: [
          {
            from: '192.168.43.247',
            to: '192.168.43.247'
          },
          {
            from: "3002';",
            to: "3002';//"
          },
        ]
      },
    },
    exec: {
      delete_prod_branch: 'git branch -D prod_master',
      create_prod_branch: 'git checkout -b prod_master',
      add: 'git add .',
      commit: 'git commit -m "dummy"',
      push: 'mup deploy',
      checkout: 'git checkout master',
    },
  };

  grunt.initConfig(config);
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('push', function() {
    var allTasks = [
      // build
      'replace:prod',
      'exec:delete_prod_branch',
      'exec:create_prod_branch',
      'exec:add',
      'exec:commit',

      // push to main server
      'exec:push',
      
      // reset
      'exec:checkout',
    ];
    for (var k in allTasks) {
      grunt.task.run(allTasks[k]);
    }
  });
};
