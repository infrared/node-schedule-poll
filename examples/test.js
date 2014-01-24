
var Poll = require('schedule-poll');

var poll = new Poll;

poll.on('error',function(err) {
    console.log(err);
});

poll.on('tick',function(items) {
    console.log(items);
});

poll.start({
    "a": 3,
    "b": 3,
    "c": 3,
    "d": 6,
    "e": 6,
    "f": 6

});
