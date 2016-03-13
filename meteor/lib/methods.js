Meteor.methods({
  waitForVideo: function(videoId) {
    Users.update({_id: Meteor.userId()}, {$set: {isReady: false, currentVideo: videoId}})
  },
  unwaitForVideo: function() {
    const userId = Meteor.userId();
    const user = Users.findOne(userId);
    const videoId = user && user.currentVideo;
    Users.update({_id: Meteor.userId()}, {$unset: {isReady: 1, currentVideo: 1}});
    if (Users.find({currentVideo: videoId}).count() === 0) {
      Videos.update({_id: videoId}, {$set: {isPlaying: false}});
    }

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