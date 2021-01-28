var mongoose = require('mongoose')
var Schema = mongoose.Schema

//add data that we need to store here
var UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  //val will be 1 or 0 (true or false).
  // if true check for company name and make make requests with that logic
  isInACompany: {
    val: Number,
    name: String,
  },
})

module.exports = mongoose.model('User', UserSchema)
