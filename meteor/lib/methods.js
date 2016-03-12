Meteor.methods({
  rotationChange: function(rotation) {
	Users.update({_id: Meteor.userId()}, {$set: {rotation:rotation}})
  },
  waitForVideo: function(videoId) {
    Users.update({_id: Meteor.userId()}, {$set: {status: 'waiting', currentVideo: videoId}})
  },
  unwaitForVideo: function() {
    Users.update({_id: Meteor.userId()}, {$unset: {status: 1, currentVideo: 1}});
  }
})