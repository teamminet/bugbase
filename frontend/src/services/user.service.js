import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api';

class UserService {
  getUserBoard() {
    return axios.get(`${API_URL}/company/dashboard`, { headers: authHeader() });
  }
  getDashboard() {
    return axios.get(`${API_URL}/kjkj`, {
      headers: authHeader(),
    });
  }
  
  getHacktivity() {
    return axios.get(`${API_URL}/hacktivity`, {
      headers: authHeader(),
    });
  }
}

export default new UserService();
