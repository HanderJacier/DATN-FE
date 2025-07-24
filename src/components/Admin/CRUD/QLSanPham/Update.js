// src/CRUD/QLSanPham/useSanPhamUpdate.js
import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useSanPhamUpdate() {
  const { data: response, callAPI: updateProductAPI, loading, error } = usePostData()
  const success = ref(false)

  const updateProduct = async (updatedProduct) => {
    success.value = false

    const paramsWithPrefix = {}
    for (const key in updatedProduct) {
      if (Object.hasOwnProperty.call(updatedProduct, key)) {
        paramsWithPrefix[`p_${key}`] = updatedProduct[key]
      }
    }

    await updateProductAPI('WBH_AD_UPD_SUASP', {
      params: paramsWithPrefix
    })

    if (!error.value) {
      success.value = true
    }
  }

  return {
    updateProduct,
    response,
    loading,
    error,
    success
  }
}
