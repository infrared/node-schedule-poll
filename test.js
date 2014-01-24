
var Poll = require('./schedule-poll.js');

var poll = new Poll;

poll.on('error',function(err) {
    console.log(err);
});

poll.start({
    "foo": 300,
    "zoo": 300,
    "zat": 300,
    "bar": 600,
    "baz": 60
});
