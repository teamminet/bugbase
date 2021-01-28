var mongoose = require('mongoose')
var Schema = mongoose.Schema

//add stuff to this schema according to whatever data we need to store
var CompanySchema = new Schema({
  cusername: String,
  cemail: String,
  cname: String,
  members: [String], // will contain _id of each user
  inScopeWebsites: [String],
  outOfScopeWebsites: [String],
  bountyVals: {
    type: Map,
    of: String
  },
  companyProfileImage: String,
  description: String,
  competitions: [String], // array of competition id's
  receivedBugs: [String] // array of bug id's
})

module.exports = mongoose.model('Company', CompanySchema)


