var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CompSchema = new Schema({ //compid generated here ie competition id
    compdata: [{ // qid generated from here ie question id
        number: Number,
        question: String,
        points: Number,
        answer: String,
        link: String
    }],
    cid: String,
    cname: String,
    isComplete:Boolean,
    submissions: [{ // sid is generated here ie submission id
        uid: String,
        username: String,
        currentScore: Number,
        answers: [{
            qid: String,
            answer: String,
            isAnswered:Boolean
        }]
    }]
})

module.exports = mongoose.model('Competition', CompSchema)