const { authJwt } = require('../middlewares')
var express = require('express')
var router = express.Router()

//this is middleware - you dont need to change this
router.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept',
  )
  next()
})

//just make routes like this like you normally do

//routes start with /api -> this route is /api/test/user
router.get('/test/user', [authJwt.verifyToken], (req, res, next) => {
  return res.send('dhruv goyal sucks')
})

module.exports = router
