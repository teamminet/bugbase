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
  getDashboard() {
    return axios.get(`${API_URL}/kjkj`, {
      headers: authHeader(),
    })
  }

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

  getHacktivity() {
    return axios.get(`${API_URL}/hacktivity`, {
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
}

export default new UserService()
