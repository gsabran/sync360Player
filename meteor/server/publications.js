Meteor.publish('usersWaitingForVideo', function() {
  return Users.find({waitingForVideo: true});
});

Meteor.publish('videos', function() {
  return Videos.find();
});
