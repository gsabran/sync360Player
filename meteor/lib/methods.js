Meteor.methods({
  rotationChange: function(rotation) {
	Users.update({_id: Meteor.userId()}, {$set: {rotation:rotation}})
  },
  waitForVideo: function(videoId) {
    Users.update({_id: Meteor.userId()}, {$set: {status: 'waiting', currentVideo: videoId}})
  },
  unwaitForVideo: function() {
    Users.update({_id: Meteor.userId()}, {$unset: {status: 1, currentVideo: 1}});
  },
  unwaitForVideo: function() {
    Users.update({_id: Meteor.userId()}, {$unset: {status: 1, currentVideo: 1}});
  },
  videoStarts: function(videoId) {
    Videos.update({_id: videoId}, {$set: {isPlaying: true}});
  },
  changeReadyState: function() {
    const userId = Meteor.userId();
    const user = Users.findOne(userId);
    Users.update({_id: userId}, {$set: {isReady: !user.isReady}});
  },
})