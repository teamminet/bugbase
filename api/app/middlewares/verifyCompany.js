const Company = require('../models/company')
const User = require('../models/user')

let checkIfCompanyExists = (req, res, next) => {
    Company.findOne({
        cusername: req.body.cusername,
    })
        .exec((err, company) => {
            if (err) {
                res.status(500).send({ message: err })
                return
            }
            if (company) {
                res.status(200).send({ message: 'Failed! Company already exists' })
                return
            }
            User.findById(req.userId).exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }
                if(user.isInACompany.cid) {
                    return res.status(200).send({ message: 'Failed! Company already exists' })
                }
                next()
            })
        })
}

const verifyCompany = { checkIfCompanyExists }

module.exports = verifyCompany