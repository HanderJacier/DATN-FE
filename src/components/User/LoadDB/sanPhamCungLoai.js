import axios from 'axios'

export async function fetchSameCategory(id_sp) {
    try {
        const response = await axios.post(
            'http://localhost:8080/api/datn/WBH_US_SEL_SANPHAM_BY_SANPHAM_DETAIL',
            {
                params: { p_id_sp: id_sp }
            }
        )

        if (Array.isArray(response.data)) {
            return response.data
                .map(item => {
                    const sp = item.fields
                    return {
                        ...sp,
                        thuongHieuHienThi: sp?.thuonghieuTen || sp?.thuonghieu_ten || 'Thương hiệu khác'
                    }
                })
                // loại bỏ sản phẩm trùng với id hiện tại
                .filter(sp => sp.id_sp !== Number(id_sp))
        }

        return []
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm cùng loại:', error)
        return []
    }
}
