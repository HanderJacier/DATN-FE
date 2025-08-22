// Encode/Decode toàn bộ route state -> token (chạy trên browser)

function b64uEncode(str) {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function b64uDecode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  const bin = atob(s)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

// checksum đơn giản chống sửa token nhầm tay
function checksum(s) {
  let n = 0
  for (let i = 0; i < s.length; i++) n = (n * 131 + s.charCodeAt(i)) % 97
  return n.toString(16).padStart(2, '0')
}

/**
 * Encode toàn bộ route state -> token
 * routeState = { name, params, query, hash }
 */
export function encodeWholeRoute(routeState) {
  const payload = JSON.stringify({
    n: routeState.name || null,
    p: routeState.params || {},
    q: routeState.query  || {},
    h: routeState.hash   || ''
  })
  const body = b64uEncode(payload)
  const sig  = checksum(body)
  return body + '.' + sig
}

/**
 * Decode token -> { name, params, query, hash } | null
 */
export function decodeWholeRoute(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null
  const [body, sig] = token.split('.')
  if (checksum(body) !== sig) return null
  let obj
  try { obj = JSON.parse(b64uDecode(body)) } catch { return null }
  if (!obj || typeof obj !== 'object') return null
  return {
    name:  obj.n || null,
    params: obj.p || {},
    query:  obj.q || {},
    hash:   obj.h || ''
  }
}
