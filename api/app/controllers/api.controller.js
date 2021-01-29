const User = require('../models/user')
const Company = require('../models/company')
const Bug = require('../models/bug')
const Competition = require('../models/competition')
const nodemailer = require('nodemailer')
const pdfMake = require('pdfmake/build/pdfmake')
const pdfFonts = require('pdfmake/build/vfs_fonts')

pdfMake.vfs = pdfFonts.pdfMake.vfs;


//initialize aws
require('dotenv').config()
var AWS = require('aws-sdk');
const AWSID = process.env.AWSACCESSKEYID;
const AWSSECRET = process.env.AWSSECRETKEY;
const nodeMailerUser = process.env.EMAIL;
const nodeMailerPass = process.env.PASS;
const BUCKET_NAME = 'bugbaseprofilepics';
const s3 = new AWS.S3({
    accessKeyId: AWSID,
    secretAccessKey: AWSSECRET,
    params: {
        Bucket: BUCKET_NAME
    }
});
//nodemailer options
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    secure: true,
    port: 465,
    RequireAuthentication: 'Yes',
    auth: {
        user: nodeMailerUser,
        pass: nodeMailerPass,
    },
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
exports.createbug = async (req, res) => {
    const bug = new Bug({
        uid: req.userId,
        cid: req.body.cid,
        chatdata: [
            {
                person: 0,
                bugdata: req.body.data
            }
        ]
    })
    await User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        user.submittedBugs.push(bug._id)
        user.save()
    })
    await Company.findById(req.body.cid).exec((err, company) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        company.receivedBugs.push(bug._id)
        company.save()
    })
    bug.save((err, bug) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        return res.status(200).send(bug)
    })
}
exports.getmessages = (req, res) => {
    if (req.body.bid.length != 24) {
        return res.status(500).send({ message: "Invalid data." })
    }
    Bug.findOne({ _id: req.body.bid, uid: req.userId }).exec((err, bug) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!bug) {
            return res.status(500).send({ message: 'Not Found' })
        }
        return res.status(200).send(bug)
    })
}
exports.sendmessage = (req, res) => {
    if (req.body.bid.length != 24) {
        return res.status(500).send({ message: "Invalid data." })
    }
    Bug.findOne({ _id: req.body.bid, uid: req.userId }).exec((err, bug) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!bug) {
            return res.status(500).send({ message: 'Not Found' })
        }
        bug.chatdata.push({
            person: 0,
            bugdata: req.body.message,
            timestamp: new Date()
        })

        bug.save((err, bug) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            return res.status(200).send(JSON.stringify(bug))
        })
    })
}
exports.getComp = (req, res) => {
    if (req.body.compid.length != 24) {
        return res.status(500).send({ message: "Invalid data." })
    }
    Competition.findById(req.body.compid).exec((err, competition) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!competition) {
            return res.status(500).send({ message: "invalid competition." })
        }
        // const [cid,cname,isComplete]=competition
        let compdata = []
        competition.compdata.forEach((question) => {
            compdata.push({
                qid: question._id,
                number: question.number,
                question: question.question,
                points: question.points,
                link: question.link
            })
        })
        let index = competition.submissions.findIndex(x => x.uid == req.userId)
        console.log(index)
        let sendComp = {
            cid: competition.cid,
            cname: competition.cname,
            isComplete: competition.isComplete,
            compdata: compdata,
            submissions: competition.submissions[index]
        }

        return res.status(200).send(sendComp)

    })

}
exports.submitAnswer = (req, res) => {
    if (req.body.compid.length != 24) {
        return res.status(500).send({ message: "Invalid data." })
    }
    Competition.findOne({ _id: req.body.compid, isComplete: false }).exec((err, competition) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!competition) {
            return res.status(500).send({ message: "invalid competition." })
        }
        let qid = req.body.qid
        let answer = req.body.answer
        let indexOfCorrectQuestion = competition.compdata.findIndex(x => x._id == qid);
        if (indexOfCorrectQuestion == -1) {
            return res.status(500).send({ message: "invalid question." })
        }
        let correctAns = competition.compdata[indexOfCorrectQuestion].answer
        const points = competition.compdata[indexOfCorrectQuestion].points;
        if (answer == correctAns) {

            let userIndex
            if (competition.submissions) {
                userIndex = competition.submissions.findIndex(x => x.uid == req.userId);
                if (userIndex == -1) {
                    //we will have to push a new element
                    userIndex = competition.submissions.push({
                        uid: '',
                        username: '',
                        currentScore: 0,
                        answers: []
                    }) - 1
                }
            } else {
                competition.submissions = [{
                    uid: '',
                    username: '',
                    currentScore: 0,
                    answers: []
                }]
                userIndex = 0
            }
            const currentAnswerArr = competition.submissions[userIndex].answers
            const currentScore = competition.submissions[userIndex].currentScore;
            try {
                const ansIndex = competition.submissions[userIndex].answers.findIndex(x => x.qid == qid)
                if (competition.submissions[userIndex].answers[ansIndex].isAnswered) {
                    return res.status(500).send({ message: "Already answered." })
                }
            }
            catch (err) {
                console.log(err)
            }

            User.findById(req.userId).exec((err, user) => {
                if (err) {
                    return res.status(500).send({ message: err })
                }
                let answerObj = [...currentAnswerArr, {
                    qid: qid,
                    answer: answer,
                    isAnswered: true
                }]
                let submissionobj = {
                    uid: req.userId,
                    username: user.username,
                    currentScore: parseInt(currentScore) + parseInt(points),
                    answers: answerObj
                }

                Object.assign(competition.submissions[userIndex], submissionobj);
                console.log(userIndex, " ", submissionobj)
                competition.save((err, comp) => {
                    if (err) {
                        return res.status(500).send({ message: err })
                    }
                    console.log(comp)
                    return res.status(200).send(comp)
                })

            })
        }
        else {
            return res.status(500).send({ message: "Incorrect answer." })
        }
    })
}
exports.getReportsViaUser = (req, res) => {
    Bug.find({ uid: req.userId }).exec((err, data) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!data) {
            return res.status(500).send({ message: "No bug found" })
        }
        return res.status(200).send(data)
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
exports.getcompmessages = (req, res) => {
    if (req.body.bid.length != 24) {
        return res.status(500).send({ message: "Invalid data." })
    }
    Bug.findOne({ _id: req.body.bid, cid: req.cid }).exec((err, bug) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!bug) {
            return res.status(500).send({ message: 'Not Found' })
        }
        return res.status(200).send(bug)
    })
}
exports.sendcompmessage = (req, res) => {
    if (req.body.bid.length != 24) {
        return res.status(500).send({ message: "Invalid data." })
    }
    Bug.findOne({ _id: req.body.bid, cid: req.cid }).exec((err, bug) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!bug) {
            return res.status(500).send({ message: 'Not Found' })
        }
        bug.chatdata.push({
            person: 1,
            bugdata: req.body.message,
            timestamp: new Date()
        })

        bug.save((err, bug) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            return res.status(200).send(JSON.stringify(bug))
        })
    })
}

exports.repincrease = (req, res) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!user.isInACompany.isIn) {
            return res.status(500).send({ message: 'you are not in a company' })
        }
        User.findOneAndUpdate({
            username: req.body.username
        }, {
            $inc: { "reputation": 5 },
            returnNewDocument: true
        }).exec((err, user) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            return res.status(200).send(JSON.stringify(user))
        })
    })
}
exports.endmessages = (req, res) => {
    if (req.body.bid.length != 24) {
        return res.status(500).send({ message: "Invalid data." })
    }
    Bug.findOne({ _id: req.body.bid, cid: req.cid, isComplete: false }).exec((err, bug) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!bug) {
            return res.status(500).send({ message: 'Not Found' })
        }
        bug.isComplete = true;
        bug.save((err, bug) => {
            let uemail, cemail;
            if (err) {
                return res.status(500).send({ message: err })
            }
            User.findById(bug.uid).exec((err, user) => {
                if (err) {
                    return res.status(500).send({ message: err })
                }
                uemail = user.email
                Company.findById(bug.cid).exec((err, company) => {
                    if (err) {
                        return res.status(500).send({ message: err })
                    }
                    cemail = company.cemail
                    const chat = JSON.stringify(bug.chatdata)
                    makePdf(chat, bug._id)
                        .then((data) => {
                            nodemail(data, uemail, cemail)
                                .then((val) => { return res.status(200).send({ msg: "mail sent" }) })
                                .catch(err => { return res.status(500).send({ message: err }) })
                        }).catch(err => { return res.status(500).send({ message: err }) })
                })
            })
        })
    })
}

exports.compCreate = (req, res) => {
    const cid = req.cid
    const cname = req.cname
    let questions = [];
    req.body.compdata.forEach((question) => {
        questions.push({
            number: question.number || null,
            question: question.question || null,
            points: question.points || 0,
            answer: question.answer || null,
            link: question.link || null
        })

    })
    const comp = new Competition({
        cid,
        cname,
        compdata: questions,
        isComplete: false
    })
    comp.save((err, data) => {
        if (err) {

            return res.status(500).send({ message: err })
        }
        Company.findById(cid).exec((err, company) => {
            if (err) {

                return res.status(500).send({ message: err })
            }
            console.log(data)
            company.competitions.push(data._id)
            company.save((err, company) => {
                if (err) {

                    return res.status(500).send({ message: err })
                }
                console.log(data)
                return res.status(200).send(data)
            })
        })
    })
}
exports.editCompetition = (req, res) => {
    if (req.body.compid.length != 24) {
        return res.status(500).send({ message: "Invalid data." })
    }

    Competition.findOne({ _id: req.body.compid, isComplete: false }).exec((err, competition) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        let questions = [];
        console.log(competition, req.body)
        req.body.compdata.forEach((question) => {
            questions.push({
                number: question.number || null,
                question: question.question || null,
                points: question.points || 0,
                answer: question.answer || null,
                link: question.link || null
            })

        })
        competition.compdata = questions
        competition.save((err, comp) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            return res.status(200).send(comp)
        })
    })
}
exports.endCompetition = (req, res) => {
    if (req.body.compid.length != 24) {
        return res.status(500).send({ message: "Invalid data." })
    }
    Competition.findOne({ _id: req.body.compid, cid: req.cid }).exec((err, competition) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        competition.isComplete = true

        competition.save((err, comp) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            return res.status(200).send(comp)
        })
    })
}
exports.getAllComp = (req, res) => {
    Competition.find({ cid: req.cid }).exec((err, competition) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!competition) {
            return res.status(500).send({ message: "no competitions" })
        }
        return res.status(200).send(JSON.stringify(competition))
    })
}

exports.getReportsViaCompany = (req, res) => {
    Bug.find({ cid: req.cid }).exec((err, data) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        if (!data) {
            return res.status(500).send({ message: "No bug found" })
        }
        return res.status(200).send(data)
    })
}

let nodemail = (chatlink, uemail, cemail) => {
    return new Promise((resolve, reject) => {
        let data = [uemail, cemail]
        var mainOptions = {
            from: nodeMailerUser,
            to: data,
            subject: "chat history",
            html: chatlink
        };
        transporter.sendMail(mainOptions, (err, info) => {
            if (err) {
                reject(err)
            }
            resolve(info)
        })
    })
}

let makePdf = (chat, bid) => {
    return new Promise((resolve, reject) => {
        var dd = {
            content: [
                {
                    text: 'Chat history',
                    style: 'header'
                },
                chat
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
            }
        }
        let pdfData = pdfMake.createPdf(dd);
        pdfData.getBase64((data) => {
            var data = {
                Key: `pdfs/${bid}`,
                Body: Buffer.from(data, 'base64'),
                ContentEncoding: 'base64',
                ContentType: 'application/pdf',
                ACL: 'public-read'
            };
            s3.upload(data, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data.Location)
                }
            });
        })
    })
}
