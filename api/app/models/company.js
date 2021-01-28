var mongoose = require('mongoose')
var Schema = mongoose.Schema

//add stuff to this schema according to whatever data we need to store
var CompanySchema = new Schema({
  username: String,
  email: String,
  name: String,
})

module.exports = mongoose.model('Company', CompanySchema)
