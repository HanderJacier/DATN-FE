import Hashids from 'hashids'
const hashids = new Hashids('techmartvn-super-secret', 8)

export const encId = (id) => hashids.encode(Number(id))
export const decId = (code) => {
  const s = String(code || '')
  if (/^\d+$/.test(s)) return Number(s)
  const arr = hashids.decode(s)
  return Array.isArray(arr) && arr.length ? Number(arr[0]) : null
}
