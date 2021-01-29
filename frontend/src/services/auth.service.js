import axios from 'axios'
let API_URL

if (process.env.NODE_ENV == 'production') {
  API_URL = 'https://api.bugbase.in/api/auth/'
} else {
  API_URL = 'http://localhost:8080/api/auth/'
}

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'signin', {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data))
        }

        return response.data
      })
  }

  logout() {
    localStorage.removeItem('user')
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password,
    })
  }
}

export default new AuthService()
