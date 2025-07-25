// src/components/User/LoadDB/useReviews.js
import { ref } from "vue"
import { usePostData } from "../../component_callApi/callAPI"

export default function useReviews() {
  const reviews = ref([])
  const reviewStats = ref(null)
  const actionResult = ref(null)

  const { data: reviewsData, callAPI: fetchReviewsAPI, loading: reviewsLoading, error: reviewsError } = usePostData()
  const { data: statsData, callAPI: fetchStatsAPI, loading: statsLoading, error: statsError } = usePostData()
  const { data: createData, callAPI: createReviewAPI, loading: createLoading, error: createError } = usePostData()
  const { data: deleteData, callAPI: deleteReviewAPI, loading: deleteLoading, error: deleteError } = usePostData()

  // Lấy đánh giá theo sản phẩm
  const fetchProductReviews = async (productId, pageNo = 1, pageSize = 10) => {
    try {
      await fetchReviewsAPI("WBH_US_SEL_DANH_GIA_THEO_SP", {
        params: {
          p_sanpham: productId,
          p_pageNo: pageNo,
          p_pageSize: pageSize,
        },
      })

      if (reviewsData.value) {
        reviews.value = Array.isArray(reviewsData.value) ? reviewsData.value : []
      }
    } catch (err) {
      console.error("Lỗi khi lấy đánh giá sản phẩm:", err)
    }
  }

  // Tạo đánh giá
  const createReview = async (userId, productId, content, rating) => {
    try {
      await createReviewAPI("WBH_US_CRT_DANH_GIA", {
        params: {
          p_taikhoan: userId,
          p_sanpham: productId,
          p_noidung: content,
          p_diemso: rating,
        },
      })
     console.log("Create review API response:", createData.value)

      // Kiểm tra kết quả trả về
     if (createData.value && Array.isArray(createData.value) && createData.value.length > 0) {
  actionResult.value = createData.value[0]
  return actionResult.value.success === 1
}
    } catch (err) {
      console.error("Lỗi khi tạo đánh giá:", err)
      return false
    }
  }

  // Xóa đánh giá
  const deleteReview = async (reviewId, userId) => {
    try {
      await deleteReviewAPI("WBH_US_DEL_DANH_GIA", {
        params: {
          p_id_dg: reviewId,
          p_taikhoan: userId,
        },
      })

      if (deleteData.value && Array.isArray(deleteData.value) && deleteData.value.length > 0) {
        return deleteData.value[0].affected_rows > 0
      }
    } catch (err) {
      console.error("Lỗi khi xóa đánh giá:", err)
      return false
    }
  }

  // Thống kê đánh giá sản phẩm
  const fetchReviewStats = async (productId) => {
    try {
      await fetchStatsAPI("WBH_US_SEL_THONG_KE_DANH_GIA", {
        params: {
          p_sanpham: productId,
        },
      })

      if (statsData.value && Array.isArray(statsData.value) && statsData.value.length > 0) {
        reviewStats.value = statsData.value[0]
      }
    } catch (err) {
      console.error("Lỗi khi lấy thống kê đánh giá:", err)
    }
  }

  return {
    reviews,
    reviewStats,
    actionResult,
    reviewsLoading,
    reviewsError,
    statsLoading,
    statsError,
    createLoading,
    createError,
    deleteLoading,
    deleteError,
    fetchProductReviews,
    createReview,
    deleteReview,
    fetchReviewStats,
  }
}
