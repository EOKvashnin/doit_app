import * as yup from 'yup'

export const phoneSchema = yup
  .string()
  .nullable()
  .transform((value) => (value === '' ? null : value)) // пустую строку → null
  .test('phone-format', 'Некорректный формат телефона', (value) => {
    if (!value) return true // ← пусто = ок

    // Если есть значение — проверяем маску и длину
    const digits = value.replace(/\D/g, '')
    return !value.includes('_') && digits.length === 11
  })
