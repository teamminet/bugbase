const User = require('../models/user')
const Company = require('../models/company')
const Bug = require('../models/bug')

//initialize aws
require('dotenv').config()
var AWS = require('aws-sdk');
const AWSID = process.env.AWSACCESSKEYID;
const AWSSECRET = process.env.AWSSECRETKEY;
const BUCKET_NAME = 'bugbaseprofilepics';
const s3 = new AWS.S3({
    accessKeyId: AWSID,
    secretAccessKey: AWSSECRET,
    params: {
        Bucket: BUCKET_NAME
    }
});

//hacker
exports.leaderboard = (req, res) => {
    User.aggregate([
        { $project: { username: 1, reputation: 1, profileImage: 1 } },
        { $sort: { reputation: -1 } },
        { $limit: 10 }
    ]).exec((err, data) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        res.status(200).send(JSON.stringify(data))
    })
}

exports.userfromid = (req, res) => {
    const looprom = new Promise((resolve, reject) => {
        let data = []
        for (let i in req.body.uids) {
            if (req.body.uids[i].length != 24) {
                reject('invalid data')
                return
            }
            User.findById(req.body.uids[i]).exec((err, user) => {
                if (err) {
                    reject(err)
                    return
                }
                if (!user) {
                    reject('user not found')
                    return
                }
                data.push({
                    username: user.username,
                    profileImage: user.profileImage || null
                })
                if (data.length == req.body.uids.length) {
                    resolve(data)
                }
            })
        }
    })
    looprom.then(data => {
        return res.status(200).send(JSON.stringify(data))
    }).catch(err => {
        return res.status(500).send({ message: err })
    })
}

exports.getusersofcompany = (req, res) => {
    let uids = []
    Company.findOne({ cusername: req.body.cusername }).exec((err, _company) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!_company) {
            return res.status(500).send({ message: 'company does not exist' })
        }
        uids = _company.members
        const looprom = new Promise((resolve, reject) => {
            let data = []
            for (let i in uids) {
                User.findById(uids[i]).exec((_err, user) => {
                    if (_err) {
                        reject(_err)
                        return
                    }
                    if (!user) {
                        reject('user not found')
                        return
                    }
                    data.push({
                        username: user.username,
                        name: user.name || null,
                        profileImage: user.profileImage || null
                    })
                    if (data.length == uids.length) {
                        resolve(data)
                    }
                })
            }
        })
        looprom.then(data => {
            return res.status(200).send(JSON.stringify(data))
        }).catch(_err => {
            return res.status(500).send({ message: _err })
        })
    })
}

exports.gethackerdata = (req, res) => {
    User.findOne({ username: req.body.username }, 'username name profileImage reputation isInACompany website').exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!user) {
            return res.status(500).send({ message: 'user does not exist' })
        }
        return res.status(200).send(JSON.stringify(user))
    })
}

exports.findone = (req, res) => {
    // return user's own details
    User.findById(req.userId)
        .exec((err, user) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            res.status(200).send(JSON.stringify(user))
        })
}
exports.handleEdit = (req, res) => {
    User.findById(req.userId).exec(async (err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.website) {
            user.website = req.body.website;
        }
        user.save((err, user) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            res.send(user)
        })
    })
}
exports.changeprofilepic = (req, res) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (req.body.profileImage) {
            let size = ((req.body.profileImage.length * (3 / 4)) - 1)
            if (size > 2097152) {
                return res.status(500).send({ message: 'image file too large' })
            }
            let buf = Buffer.from(req.body.profileImage.replace(/^data:image\/\w+;base64,/, ""), 'base64')
            var data = {
                Key: req.userId,
                Body: buf,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg',
                ACL: 'public-read'
            };
            s3.upload(data, (err, data) => {
                if (err) {
                    console.log(err);
                    console.log('Error uploading data: ', data);
                    return res.status(500).send({ message: err })
                } else {
                    user.profileImage = data.Location
                    user.save((err, user) => {
                        if (err) {
                            return res.status(500).send({ message: err })
                        }
                        res.status(200).send(user)
                    })
                }
            });
        } else {
            res.status(500).send({ message: 'invalid data' })
        }
    })
}

exports.hacktivity = (req, res) => {
    let sorttype = req.query.sorttype
    /*
    a2z => a to z
    z2a => z to a
    lthb => lowest to highest minimum bounty
    htlb => highest to lowest minimum bounty
    */
    let fields = 'cusername cname bountyVals description companyProfileImage'
    if (sorttype == 'a2z') {
        Company.find({}, fields, { sort: { cusername: 1 } }, (err, companies) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            res.status(200).send(JSON.stringify(companies))
        })
    } else if (sorttype == 'z2a') {
        Company.find({}, fields, { sort: { cusername: -1 } }, (err, companies) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            res.status(200).send(JSON.stringify(companies))
        })
    } else if (sorttype == 'lthb') {
        Company.find({}, fields, { sort: { 'bountyVals.low': 1 } }, (err, companies) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            res.status(200).send(JSON.stringify(companies))
        })
    } else if (sorttype == 'htlb') {
        Company.find({}, fields, { sort: { 'bountyVals.low': -1 } }, (err, companies) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            res.status(200).send(JSON.stringify(companies))
        })
    } else {
        Company.find({}, fields, { sort: { cusername: 1 } }, (err, companies) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            res.status(200).send(JSON.stringify(companies))
        })
    }
}

exports.singlehacktivity = (req, res) => {
    Company.findOne({ cusername: req.body.cusername }).exec((err, company) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!company) {
            return res.status(500).send({ message: 'Not found' })
        }
        let tosend = {
            cid: company._id,
            cname: company.cname || null,
            cusername: company.cusername || null,
            members: company.members || null,
            inScopeWebsites: company.inScopeWebsites || null,
            outOfScopeWebsites: company.outOfScopeWebsites || null,
            bountyVals: company.bountyVals || null,
            description: company.description || null,
            companyProfileImage: company.companyProfileImage || null
        }
        return res.status(200).send(JSON.stringify(tosend))
    })
}
//company

exports.createcompany = (req, res) => {
    const company = new Company({
        cname: req.body.cname,
        cemail: req.body.cemail,
        cusername: req.body.cusername,
        members: [req.userId] // initialize first member as creator
    })

    company.save((err, company) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
    })

    User.findById(req.userId, (err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        user.isInACompany.isIn = true
        user.isInACompany.cid = company._id
        user.isInACompany.cname = req.body.cname
        user.save((err, use) => {
            if (err) {
                res.status(500).send({ message: err })
                return
            }
            res.send({ message: 'Company was created successfully' })
        })
    })
}
exports.companydashboard = (req, res) => {
    let cid = req.cid // from middleware
    Company.findById(cid).exec((err, company) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        return res.status(200).send(JSON.stringify(company))
    })
}
exports.editcompany = (req, res) => {
    let cid = req.cid // from middleware
    Company.findById(cid, (err, company) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (req.body.cname) { //name
            company.cname = req.body.cname
        }
        if (req.body.description) { // description
            company.description = req.body.description
        }
        if (req.body.inscope) { // in scope add
            company.inScopeWebsites = req.body.inscope
            company.inScopeWebsites = [...new Set(company.inScopeWebsites)]; // remove dupes
        }
        if (req.body.outofscope) { // out of scope add
            company.outOfScopeWebsites = req.body.outofscope // add some validation
            company.outOfScopeWebsites = [...new Set(company.outOfScopeWebsites)]; // remove dupes
        }
        if (req.body.bountyVals) { // bountyvals
            let bountyVals = req.body.bountyVals // array [low, medium, high, critical]
            if (bountyVals.length != 4) {
                return res.status(500).send({ message: 'array must be of length 4' })
            }
            company.bountyVals = new Map
            company.bountyVals.set('low', bountyVals[0].toString())
            company.bountyVals.set('medium', bountyVals[1].toString())
            company.bountyVals.set('high', bountyVals[2].toString())
            company.bountyVals.set('critical', bountyVals[3].toString())
        }
        company.save((err, company) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            return res.status(200).send(JSON.stringify(company))
        })
    })
}
exports.changeComapanyProfilePic = (req, res) => {
    Company.findById(req.cid).exec((err, company) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (req.body.companyProfileImage) {
            let size = ((req.body.companyProfileImage.length * (3 / 4)) - 1)
            if (size > 2097152) {
                return res.status(500).send({ message: 'image file too large' })
            }
            let buf = Buffer.from(req.body.companyProfileImage.replace(/^data:image\/\w+;base64,/, ""), 'base64')
            var data = {
                Key: req.cid,
                Body: buf,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg',
                ACL: 'public-read'
            };
            s3.upload(data, (err, data) => {
                if (err) {
                    console.log(err);
                    console.log('Error uploading data: ', data);
                    return res.status(500).send({ message: err })
                } else {
                    company.companyProfileImage = data.Location
                    company.save((err, company) => {
                        if (err) {
                            return res.status(500).send({ message: err })
                        }
                        res.status(200).send(company)
                    })
                }
            });
        } else {
            res.status(500).send({ message: 'invalid data' })
        }
    })
}
exports.addtocompany = (req, res) => {
    User.findOne({ username: req.body.username }).exec((err, user) => { // this is the user we want too add
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!user) {
            return res.status(500).send({ message: 'user does not exist' })
        }
        if (user.isInACompany.isIn) {
            return res.status(500).send({ message: 'user already in a company' })
        }
        user.isInACompany.isIn = true
        user.isInACompany.cid = req.cid
        user.isInACompany.cname = req.cname
        user.save((err, user) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            Company.findById(req.cid).exec((err, company) => {
                if (err) {
                    return res.status(500).send({ message: err })
                }
                company.members.push(user._id)
                company.save((err, company) => {
                    if (err) {
                        return res.status(500).send({ message: err })
                    }
                    res.status(200).send(JSON.stringify(company))
                })
            })
        })
    })
}
exports.removefromcompany = (req, res) => {
    User.findOne({ 'username': req.body.username, 'isInACompany.cid': req.cid }).exec((err, user) => { // user to be removed
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!user) {
            return res.status(500).send({ message: 'Not found' })
        }
        user.isInACompany.isIn = false
        user.isInACompany.cid = null
        user.isInACompany.cname = null
        user.save((err, user) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            Company.findById(req.cid).exec((err, company) => {
                if (err) {
                    return res.status(500).send({ message: err })
                }
                let index = company.members.indexOf(user._id);
                if (index !== -1) {
                    company.members.splice(index, 1);
                }
                company.save((err, company) => {
                    if (err) {
                        return res.status(500).send({ message: err })
                    }
                    res.status(200).send(JSON.stringify(company))
                })
            })
        })
    })
}