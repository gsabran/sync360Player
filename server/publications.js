Meteor.publish('usersWaitingForVideo', function() {
  return Users.find({waitingForVideo: true});
});
