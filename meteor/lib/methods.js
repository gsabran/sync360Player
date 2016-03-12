Meteor.methods({
  waitForVideo: function(videoId) {
    Users.update({_id: Meteor.userId()}, {$set: {status: 'waiting', waitingForVideo: videoId}})
  },
  unwaitForVideo: function() {
    Users.update({_id: Meteor.userId()}, {$unset: {status: 1, waitingForVideo: 1}});
  }
})