var express = require('express')
var router = express.Router()
const { verifySignUp } = require('../middlewares')
const controller = require('../controllers/auth.controller')

router.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept',
  )
  next()
})

// these are auth routes - you probably do not need to change them.
// this route is /api/auth/signup
router.post(
  '/signup',
  [verifySignUp.checkDuplicateUsernameOrEmail],
  controller.signup,
)

router.post('/signin', controller.signin)

module.exports = router
