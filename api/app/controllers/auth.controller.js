var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
const config = require('../config/auth.config')
// Load models
const User = require('../models/user')

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    isInACompany: { isIn: false, cid: null, cname: null },
    reputation: 0,
    name: '',
    website: null,
    programsJoined: [],
    submittedBugs: []
  })

  console.log(user)

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }

    res.send({ message: 'User was registered successfully!' })
  })
}

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate('-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }

      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        })
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      })

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token,
      })
    })
}
