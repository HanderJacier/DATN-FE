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
// ✅ Export hàm đúng cách
export function postFeedback(data) {
  return apiClient.post('/san-pham/tao-gop-y', data)
}
