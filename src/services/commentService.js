import { showToast } from '@/utils/toast'

export class CommentService {
  constructor(store, taskId) {
    this.store = store
    this.taskId = taskId
  }

  async addComment(text, authorEmail) {
    const newComment = {
      id: Date.now().toString(),
      authorEmail,
      date: new Date().toISOString(),
      text,
    }

    try {
      await this.store.dispatch('tasks/addComment', {
        taskId: this.taskId,
        comment: newComment,
      })

      return newComment
    } catch (error) {
      showToast.error('Не удалось сохранить комментарий')
      throw error
    }
  }

  async removeComment(commentId) {
    try {
      await this.store.dispatch('tasks/removeComment', {
        taskId: this.taskId,
        commentId,
      })
    } catch (error) {
      showToast.error('Ошибка при удалении комментария')
      throw error
    }
  }
}
