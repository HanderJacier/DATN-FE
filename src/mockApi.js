
import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default {
    postFeedback(content) {
        return apiClient.post('/feedbacks', {
            content: content,
            createdAt: new Date().toISOString()
        })
    }
}
