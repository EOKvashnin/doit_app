// Функция для получения цвета по типу приоритета
export default function getPriorityColor(priorityType) {
  const colorMap = {
    urgent: 'urgent',
    high: 'high',
    medium: 'medium',
    low: 'low',
  }
  return colorMap[priorityType] || 'low'
}
