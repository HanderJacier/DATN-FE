import { ref } from 'vue'
import { usePostData } from '@/components/component_callApi/callAPI'

export default function useSanPhamCreate() {
  const { data: response, callAPI: createProductAPI, loading, error } = usePostData()
  const success = ref(false)

  const createProduct = async (newProduct) => {
    success.value = false

    // Map các trường newProduct thành key p_...
    const paramsWithPrefix = {}
    for (const key in newProduct) {
      if (Object.hasOwnProperty.call(newProduct, key)) {
        paramsWithPrefix[`p_${key}`] = newProduct[key]
      }
    }

    await createProductAPI('WBH_AD_CRT_THEMSP', {
      params: paramsWithPrefix
    })

    if (!error.value) {
      success.value = true
    }
  }

  return {
    createProduct,
    response,
    loading,
    error,
    success,
  }
}
