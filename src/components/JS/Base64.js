export async function fileToBase64Src(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)  // result là chuỗi base64 có sẵn tiền tố
    reader.onerror = reject
    reader.readAsDataURL(file)  // quan trọng: đọc dạng Data URL
  })
}
// base64ToImageSrc.js
export function base64ToImageSrc(base64String) {
  if (base64String.startsWith('data:image/')) {
    return base64String
  }
  return `data:image/png;base64,${base64String}`
}
