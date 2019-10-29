/* Basic Utility */

var util = {};

// function to check if javascript object is empty (https://coderwall.com/p/_g3x9q/how-to-check-if-javascript-object-is-empty)
util.isJSObjectEmpty = function(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

module.exports = util;