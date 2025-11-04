export function normalizePhoneForServer(phone) {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '').slice(-11)
  if (digits.length !== 11) return ''
  const num = digits.startsWith('7') || digits.startsWith('8') ? digits.substring(1) : digits
  return `8${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6, 8)}-${num.slice(8, 10)}`
}
export function formatPhoneForInput(phone) {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10) return '+7 (___) ___-__-__'
  const num = digits.slice(-10).padEnd(10, '0')
  return `+7 (${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6, 8)}-${num.slice(8, 10)}`
}
