import axios from 'axios'
import authHeader from './auth-header'
let API_URL

if (process.env.NODE_ENV == 'production') {
  API_URL = 'https://bugbase.herokuapp.com/api'
} else {
  API_URL = 'http://localhost:8080/api'
}

class UserService {
  getMyCompany() {
    return axios.get(`${API_URL}/company/dashboard`, { headers: authHeader() })
  }

  getLeaderboard() {
    return axios.get(`${API_URL}/leaderboard`, { headers: authHeader() })
  }

  getHacker(username) {
    return axios.post(
      `${API_URL}/hacker`,
      {
        username,
      },
      {
        headers: authHeader(),
      },
    )
  }

  // getDashboard() {
  //   return axios.get(`${API_URL}/kjkj`, {
  //     headers: authHeader(),
  //   })
  // }

  getCompanyDashboard() {
    return axios.get(`${API_URL}/company/dashboard`, {
      headers: authHeader(),
    })
  }

  getProfile() {
    return axios.get(`${API_URL}/dashboard`, {
      headers: authHeader(),
    })
  }

  getHacktivity(sort) {
    return axios.get(`${API_URL}/hacktivity?sorttype=${sort}`, {
      headers: authHeader(),
    })
  }

  getSpecificComp(username) {
    return axios.post(
      `${API_URL}/hacktivity`,
      {
        cusername: username,
      },
      {
        headers: authHeader(),
      },
    )
  }

  updateCompanyProfile(cname, description, inscope, outofscope, bountyVals) {
    return axios.post(
      `${API_URL}/company/dashboard`,
      {
        cname,
        description,
        inscope,
        outofscope,
        bountyVals,
      },
      {
        headers: authHeader(),
      },
    )
  }

  updateProfilePic(imgData) {
    return axios.post(
      `${API_URL}/dashboard/changeprofilepic`,
      {
        profileImage: imgData,
      },
      {
        headers: authHeader(),
      },
    )
  }

  updateCompanyProfilePic(imgData) {
    return axios.post(
      `${API_URL}/company/dashboard/changeprofilepic`,
      {
        companyProfileImage: imgData,
      },
      {
        headers: authHeader(),
      },
    )
  }

  updateProfile(name, website) {
    return axios.post(
      `${API_URL}/dashboard`,
      {
        name,
        website,
      },
      {
        headers: authHeader(),
      },
    )
  }

  //get user submitted reports
  getUserReports() {
    return axios.post(
      `${API_URL}/hacktivity/getreports`,
      {},
      {
        headers: authHeader(),
      },
    )
  }

  //get all company reports
  getCompanyReports() {
    return axios.post(
      `${API_URL}/company/hacktivity/getreports`,
      {},
      {
        headers: authHeader(),
      },
    )
  }

  //get company
  getCompanyReportData(bid) {
    return axios.post(
      `${API_URL}/company/hacktivity/status`,
      {
        bid,
      },
      {
        headers: authHeader(),
      },
    )
  }

  //add member to your company
  addUserToCompany(username) {
    return axios.post(
      `${API_URL}/company/dashboard/adduser`,
      {
        username,
      },
      {
        headers: authHeader(),
      },
    )
  }

  //remove a member from company
  removeUserFromCompany(username) {
    return axios.post(
      `${API_URL}/company/dashboard/removeuser`,
      {
        username,
      },
      {
        headers: authHeader(),
      },
    )
  }

  //get member data from company
  getCompanyMembers(cusername) {
    return axios.post(
      `${API_URL}/getusersofcompany`,
      {
        cusername,
      },
      {
        headers: authHeader(),
      },
    )
  }

  submitReport(cid, mdstring) {
    return axios.post(
      `${API_URL}/hacktivity/report`,
      {
        cid: cid,
        data: mdstring,
      },
      {
        headers: authHeader(),
      },
    )
  }

  createCompany(name, email, username) {
    return axios.post(
      `${API_URL}/company/make`,
      {
        cname: name,
        cemail: email,
        cusername: username,
      },
      {
        headers: authHeader(),
      },
    )
  }

  increaseRep(username) {
    return axios.post(
      `${API_URL}/company/repincrease`,
      {
        username,
      },
      {
        headers: authHeader(),
      },
    )
  }

  // CHATTING FUNCTIONALITY

  //send company side message
  sendCompanyMsg(bid, message) {
    return axios.post(
      `${API_URL}/company/hacktivity/status/send`,
      {
        bid,
        message,
      },
      {
        headers: authHeader(),
      },
    )
  }

  //send user side message
  sendUserMsg(bid, message) {
    return axios.post(
      `${API_URL}/hacktivity/status/send`,
      {
        bid,
        message,
      },
      {
        headers: authHeader(),
      },
    )
  }

  //COMPETITIONS FUNCTIONALITY
  createCompetition(compdata) {
    return axios.post(
      `${API_URL}/company/competition/create`,
      {
        compdata,
      },
      {
        headers: authHeader(),
      },
    )
  }

  getSpecificCompetition(compid) {
    return axios.post(
      `${API_URL}/competition/getcomp`,
      {
        compid,
      },
      {
        headers: authHeader(),
      },
    )
  }

  submitAnswer(qid, answer, compid) {
    return axios.post(
      `${API_URL}/competition/submit`,
      {
        qid,
        answer,
        compid,
      },
      {
        headers: authHeader(),
      },
    )
  }

  //get all company ongoing competitions
  getAllCompetitions() {
    return axios.get(`${API_URL}/company/competition/getComp`, {
      headers: authHeader(),
    })
  }

  submitEdit(compid, compdata) {
    return axios.post(
      `${API_URL}/company/competition/edit`,
      {
        compid,
        compdata,
      },
      {
        headers: authHeader(),
      },
    )
  }

  //end a competition
  endCompetition(compid) {
    return axios.post(
      `${API_URL}/company/competition/end`,
      {
        compid,
      },
      {
        headers: authHeader(),
      },
    )
	}
	
	//get company specific comps
	getSpecificCompetitionforCompany(cid) {
    return axios.post(
      `${API_URL}/competition/getcompofcompany`,
      {
        cid,
      },
      {
        headers: authHeader(),
      },
    )
  }
}

export default new UserService()
