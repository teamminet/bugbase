var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BugSchema = new Schema({
    chatdata: [{
        person: Number, // 0 for hacker and 1 for company
        bugdata: String,
        timestamp: Date
    }],
    uid: String,
    cid: String,
    isComplete: Boolean
})

module.exports = mongoose.model('Bug', BugSchema)