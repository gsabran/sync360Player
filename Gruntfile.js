module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  var config = {
    pkg: grunt.file.readJSON('package.json'),
    replace: {
      prod: { // replace string patterns
        src: [
          './meteor/client/lib/socketManager.js',
          './socketServer/index.js',
        ],
        overwrite: true,
        replacements: [
          {
            from: '192.168.43.247',
            to: '54.183.177.212'
          },
          {
            from: "3002';",
            to: "8080';//"
          },
          {
            from: "var port = 3002;",
            to: "var port = 8080;"
          },
        ]
      },
    },
    exec: {
      delete_prod_branch: 'git branch -D prod_master',
      create_prod_branch: 'git checkout -b prod_master',
      add: 'git add .',
      commit: 'git commit -m "dummy"',
      goToMeteor: 'cd meteor',
      goToRoot: 'cd ../ ',
      deploy: 'mup deploy',
      push: 'git push origin prod_master --force',
      checkout: 'git checkout master',
      reboot_server: 'ssh -i ~/.ssh/hackathon.pem ubuntu@54.183.177.212  "./restart.sh"',
    },
  };

  grunt.initConfig(config);
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('pushMeteor', function() {
    var allTasks = [
      // build
      'replace:prod',
      'exec:delete_prod_branch',
      'exec:create_prod_branch',
      'exec:add',
      'exec:commit',

      // push to main server
      'exec:goToMeteor',
      'exec:deploy',
      'exec:goToRoot',
      
      // reset
      'exec:checkout',
    ];
    for (var k in allTasks) {
      grunt.task.run(allTasks[k]);
    }
  });

  grunt.registerTask('pushWS', function() {
    var allTasks = [
      // build
      'replace:prod',
      'exec:delete_prod_branch',
      'exec:create_prod_branch',
      'exec:add',
      'exec:commit',

      // push to github
      'exec:push',
      'exec:reboot_server',
      
      // reset
      'exec:checkout',
    ];
    for (var k in allTasks) {
      grunt.task.run(allTasks[k]);
    }
  });
};
