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
    var schedule = { };
    
    
    for (var key in config) {
        if (groups[ config[key] ] === undefined) {
            groups[ config[key] ] = [ ];
        }
        groups[config[key] ].push(key);
    }
    this.groups = groups;
    for (var interval in groups) {
        
        var members = groups[interval].length;
        var iter = 1;
        if (members/interval >= 1) {
            
            var sets = this.max/interval;
            
            while(members >= 1) {
                
                if (iter > interval) iter = 1;
                var set = 0;
                while (set < sets) {
                    
                    var slot;
                    if (set === 0) {
                        slot = iter;
                    } else {
                        slot = (set * interval) + iter;
                    }
                    if (schedule[slot] === undefined) {
                        schedule[slot] = [ ];
                    }
                    schedule[slot].push( groups[interval][members - 1]);
                    set++;
                    
                    
                }
                iter++;
                members--;
                
            }
            
            
        } else {
            var rate = Math.floor(1/(members/interval));
            var sets = this.max/interval;
            
            while (members >=1) {
                if (iter >= interval) iter = 1;
                var set = 0;
                while (set < sets) {
                    var slot;
                    if (set === 0) {
                        slot = iter + (rate -1);
                    } else {
                        slot = (set * interval) + (iter + (rate -1));
                    }
                    if (schedule[slot] === undefined) {
                        schedule[slot] = [ ];
                    }
                    schedule[slot].push( groups[interval][members -1]);
                    set++;
                    
                    
                }
                iter += rate;
                members--;
                
                
            }
            
            
        }
        
        
    }
    this.schedule = schedule;
    var self = this;
    
    setInterval(function() { self.which() },1000);

    

    
}

Poll.prototype.getCurrent = function() {
    
    var max = this.max;
    var dt = new Date();
    var second = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
    
    var y = 0;
    if (second > max) {
        while (y < second) {
            y += max;
        }
        this.current =  second - (y - max);
    } else {
        this.current =  second;
    }
    
}
Poll.prototype.which = function () {
    
    this.getCurrent();
    if (this.schedule[this.current] !== undefined) {
        
        this.emit('tick', this.schedule[this.current]);
        
    }
    
    
}
module.exports = Poll;
