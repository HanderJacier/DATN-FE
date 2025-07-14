// api.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // Gửi session cookie
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient


export function postFeedback(data) {
  return apiClient.post('/san-pham/tao-gop-y', data)
}

export function fetchFeedback(page = 1, size = 10) {
  return apiClient.get('/san-pham/gop-y', {
    params: {
      p_pageNo: page,
      p_pageSize: size,
    },
  });
}