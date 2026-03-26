import { showToast } from '@/utils/toast'

export class TaskService {
  constructor(store) {
    this.store = store
  }

  async updateTask(taskId, data) {
    try {
      const now = new Date().toISOString()
      const updatedData = {
        ...data,
        editedAt: now,
      }

      this.store.commit('tasks/updateTask', updatedData)
      await this.store.dispatch('tasks/update', {
        id: taskId,
        data: updatedData,
      })

      showToast.success('Данные успешно обновлены')
      return updatedData
    } catch (error) {
      showToast.error('Не удалось сохранить изменения: ' + (error.message || 'неизвестная ошибка'))
      throw error
    }
  }

  async updateField(taskId, field, value) {
    try {
      const now = new Date().toISOString()

      // ✅ 1. Получаем текущую задачу из store
      const currentTask = this.store.getters['tasks/tasks'].find((t) => t.id === taskId)

      if (!currentTask) {
        throw new Error('Задача не найдена в store')
      }

      // ✅ 2. Создаём полный объект с обновлением
      const updatedData = {
        ...currentTask, // ← сохраняем ВСЕ поля задачи
        [field]: value, // ← обновляем нужное поле
        editedAt: now,
        id: taskId, // ← явно добавляем id для мутации
      }

      // ✅ 3. Обновляем локальный store ПОЛНЫМ объектом
      this.store.commit('tasks/updateTask', updatedData)

      // ✅ 4. Отправляем на сервер (здесь можно отправить только изменённые поля)
      await this.store.dispatch('tasks/update', {
        id: taskId,
        data: {
          [field]: value,
          editedAt: now,
        },
      })

      showToast.success(`${this.getFieldName(field)} успешно обновлён`)
      return updatedData
    } catch (error) {
      showToast.error(`Ошибка при обновлении ${this.getFieldName(field)}: ${error.message}`)
      throw error
    }
  }

  getFieldName(field) {
    const fields = {
      status: 'Статус',
      priority: 'Приоритет',
      title: 'Название',
      description: 'Описание',
    }
    return fields[field] || field
  }
}
