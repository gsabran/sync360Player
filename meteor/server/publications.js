Meteor.publish('usersWaitingForVideo', function(videoId) {
  return Users.find({waitingForVideo: videoId});
});

Meteor.publish('videos', function() {
  return Videos.find();
});
