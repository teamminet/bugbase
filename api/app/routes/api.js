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


module.exports = router
