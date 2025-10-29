const formatterDate = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export default function formatDate(date) {
  if (!date || isNaN(Date.parse(date))) {
    return 'Дата не указана' // Возвращаем fallback вместо ошибки
  }

  const formattedDate = formatterDate.format(new Date(date))
  return formattedDate
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
