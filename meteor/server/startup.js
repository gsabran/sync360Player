
restart = function() {
  Videos.remove({});
  
  if (Videos.find().count() === 0)
    Videos.insert({
      title: "Where's Waldo 360",
      url: "/videos/videos/example2.mp4",
      preview: "https://s3.amazonaws.com/mettavr/dev/example.png",
    });
  Videos.update({}, {$set: {isPlaying: false}, $unset: {masterId: 1}}, {multi: true});
  Users.update({}, {$unset: {isReady: 1, currentVideo: 1}}, {multi: true});
}

Meteor.startup(function () {
  restart();
});
