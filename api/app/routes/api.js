const { authJwt, verifyCompany, getCompany } = require('../middlewares')
var express = require('express')
var router = express.Router()
const controller = require('../controllers/api.controller')

//this is middleware - you dont need to change this
router.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept',
  )
  next()
})

// HACKER
router.get('/leaderboard', [authJwt.verifyToken], controller.leaderboard) // get leaderboard
router.post('/userfromid', [authJwt.verifyToken], controller.userfromid) // get users from id[]
router.post('/getusersofcompany', [authJwt.verifyToken], controller.getusersofcompany) // get users of company
router.post('/hacker', [authJwt.verifyToken], controller.gethackerdata) // get hacker data

router.get('/dashboard', [authJwt.verifyToken], controller.findone) // get user data
router.post('/dashboard',[authJwt.verifyToken],controller.handleEdit ) // change user data
router.post('/dashboard/changeprofilepic',[authJwt.verifyToken],controller.changeprofilepic ) // change profile pic

router.get('/hacktivity', [authJwt.verifyToken], controller.hacktivity) // get all sorted programs
router.post('/hacktivity', [authJwt.verifyToken], controller.singlehacktivity) // get specific program

router.post('/hacktivity/report', [authJwt.verifyToken], controller.createbug) // submit bug
router.post('/hacktivity/status', [authJwt.verifyToken], controller.getmessages) // get messages
router.post('/hacktivity/status/send', [authJwt.verifyToken], controller.sendmessage) // add single message
router.post('/hacktivity/getreports',[authJwt.verifyToken],controller.getReportsViaUser) // gets all the bugs submit by a user

router.post('/competition/getComp',[authJwt.verifyToken],controller.getComp)   // this will get comp based on compid
router.post('/competition/submit',[authJwt.verifyToken],controller.submitAnswer) //submits competition answer 

// COMPANY
router.post('/company/make', [
  authJwt.verifyToken, 
  verifyCompany.checkIfCompanyExists,
], controller.createcompany) // create company

router.get('/company/dashboard', [ // get company info
  authJwt.verifyToken, 
  getCompany.getCompanyID, 
], controller.companydashboard) 

router.post('/company/dashboard', [ // edit company info
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.editcompany) 

router.post('/company/dashboard/changeprofilepic', [ // change company profile picture
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.changeComapanyProfilePic) 

router.post('/company/dashboard/adduser', [ // add user to company
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.addtocompany) 

router.post('/company/dashboard/removeuser', [ // remove user from company
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.removefromcompany) 

router.post('/company/hacktivity/status', [ // get all messages
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.getcompmessages)

router.post('/company/hacktivity/status/send', [ // send one message
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.sendcompmessage)

router.post('/company/repincrease', [ // send one message
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.repincrease)

router.post('/company/hacktivity/status/end', [ 
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.endmessages)

router.post('/company/competition/create', [ 
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.compCreate)   // creates competition
router.post('/company/competition/edit', [ 
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.editCompetition)  // edits competition
router.post('/company/competition/end', [ 
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.endCompetition)  // ends competition 
router.get('/company/competition/getComp', [ 
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.getAllComp)  // get all competition for a company 

router.post('/company/hacktivity/getreports', [ 
  authJwt.verifyToken, 
  getCompany.getCompanyID,
], controller.getReportsViaCompany)   // gets all the bug recieved by a company

module.exports = router
