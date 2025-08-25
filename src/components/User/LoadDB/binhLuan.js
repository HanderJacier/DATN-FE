
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api/datn'

// Lấy danh sách đánh giá theo sản phẩm
export async function getReviewsByProduct(productId, pageNo = 1, pageSize = 100) {
    try {
        const res = await axios.post(`${API_BASE}/WBH_US_SEL_DANH_GIA_THEO_SP`, {
            params: {
                p_sanpham: productId,
                p_pageNo: pageNo,
                p_pageSize: pageSize
            }
        })
        return res.data
    } catch (err) {
        console.error('Lỗi khi lấy danh sách đánh giá:', err)
        throw err
    }
}

// Gửi hoặc cập nhật đánh giá
export async function createOrUpdateReview(userId, productId, content, rating) {
    try {
        const res = await axios.post(`${API_BASE}/WBH_US_CRT_DANH_GIA`, {
            params: {
                p_taikhoan: userId,
                p_sanpham: productId,
                p_noidung: content,
                p_diemso: rating
            }
        })
        return res.data
    } catch (err) {
        console.error('Lỗi khi gửi đánh giá:', err)
        throw err
    }
}
