const User = require('../models/user')

let getCompanyID = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        if(!user.isInACompany.cid) {
            return res.status(400).send({ message: 'Company does not exist' }) 
        }
        req.cid = user.isInACompany.cid
        req.cname = user.isInACompany.cname
        next()
    })
}

const getCompany = { getCompanyID }

module.exports = getCompany