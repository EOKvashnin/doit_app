export const dateFormatter = {
  formatDateTime(date) {
    return new Intl.DateTimeFormat('ru-RU', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date))
  },

  formatTimeAgo(date) {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)

    if (minutes < 60) return `${minutes} мин назад`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} ч назад`
    const days = Math.floor(hours / 24)
    return `${days} дн назад`
  },
}
