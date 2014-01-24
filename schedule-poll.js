var Poll = function() { };

var events = require('events');
var util = require('util');



var Poll = function() {
 
    events.EventEmitter.call(this);
};

util.inherits(Poll, events.EventEmitter);





Poll.prototype.start = function(config) {
    
    var intervals = [ ];

    for (var key in config) {
        if (86400 % config[key] !== 0) {
            var err = new Error(config[key] + " (" + key + ") is not an even divisor of 86400");
            this.emit('error', err);
        }
        intervals.push(config[key]);
    }
    this.intervals = intervals;
    this.max = Math.max.apply(null, intervals);
    this.config = config;
    
    var groups =  { };
    for (var key in config) {
        if (groups[ config[key] ] === undefined) {
            groups[ config[key] ] = [ ];
        }
        groups[config[key] ].push(key);
    }
    console.log(groups);

    

    
}

module.exports = Poll;
