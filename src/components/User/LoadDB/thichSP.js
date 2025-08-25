import axios from 'axios'

const API_BASE = 'http://localhost:8080/api/datn'

// Lấy danh sách sản phẩm yêu thích của người dùng
export async function getFavoritesByUser(userId) {
    try {
        const res = await axios.get(`${API_BASE}/WBH_US_SEL_SP_YT`, {
            params: { p_id_tk: userId }
        })
        return res.data
    } catch (err) {
        console.error('Lỗi khi lấy danh sách Yêu thích:', err)
        throw err
    }
}

// Cập nhật trạng thái yêu thích (thêm hoặc bỏ)
export async function toggleFavorite(productId, userId) {
    try {
        const res = await axios.post(`${API_BASE}/WBH_US_UPD_CAPNHAT_YT_SP`, {
            params: {
                p_sanpham: productId,
                p_taikhoan: userId
            }
        })
        return res.data
    } catch (err) {
        console.error('Lỗi khi cập nhật Yêu thích:', err)
        throw err
    }
}
