Meteor.startup(function () {
  Videos.remove({});
  Videos.insert({
    title: "Where's Waldo 360",
    url: "/videos/videos/exmaple.mp4",
    preview: "videos/previews/example.jpg",
  });
});
