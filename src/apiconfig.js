import apiClient from './api' // ← Đường tương đối tới file api.js

export async function getImageBlobUrl(imageName) {
  try {
    const response = await apiClient.get(`/images/${imageName}`, {
      responseType: 'blob',
    })
    const blob = response.data
    const url = URL.createObjectURL(blob)
    return { url, size: blob.size }
  } catch (error) {
    console.error('Lỗi tải ảnh blob:', error)
    throw error
  }
}
