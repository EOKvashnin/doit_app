const formatterDate = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
})

export default function formatDateTable(date) {
  if (!date || isNaN(Date.parse(date))) {
    return 'Дата не указана' // Возвращаем fallback вместо ошибки
  }

  const formattedDate = formatterDate.format(new Date(date))
  return formattedDate
}
