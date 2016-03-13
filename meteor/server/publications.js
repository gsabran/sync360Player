Meteor.publish('usersOnVideo', function(videoId) {
  return Users.find({currentVideo: videoId});
});

Meteor.publish('videos', function() {
  return Videos.find();
});
Meteor.publish('video', function(videoId) {
  return Videos.find({_id: videoId});
});