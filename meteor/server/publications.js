Meteor.publish('usersRotationForVideo', function(videoId) {
  return Users.find({currentVideo: videoId});
});

Meteor.publish('userscurrentVideo', function(videoId) {
  return Users.find({currentVideo: videoId});
});

Meteor.publish('videos', function() {
  return Videos.find();
});
