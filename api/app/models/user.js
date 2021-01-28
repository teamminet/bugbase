var mongoose = require('mongoose')
var Schema = mongoose.Schema

//add data that we need to store here
var UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  reputation: Number,
  name:String,
  profileImage: String,
  website: String,
  isInACompany: {
    isIn: Boolean,
    cid: String,
    cname: String,
  },
  programsJoined:[
    {
      cid: String,
      cname: String,
      cusername: String
    }
  ],
  submittedBugs: [String] ,// list of bug ids
})

module.exports = mongoose.model('User', UserSchema)
