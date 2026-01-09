import { showToast } from '@/utils/toast'

export default {
  namespaced: true,

  getters: {
    displayName(state, getters, rootState, rootGetters) {
      const email = rootGetters['auth/userEmail']
      return rootGetters['users/getDisplayNameByEmail'](email)
    },
    avatarUrl(state, getters, rootState, rootGetters) {
      const email = rootGetters['auth/userEmail']
      return rootGetters['users/getAvatarByEmail'](email)
    },
  },

  actions: {
    async load({ dispatch, rootGetters }) {
      //Загружаем всех пользователей
      await dispatch('users/loadAll', null, { root: true })
    },

    /**
     * Сохраняет или создаёт профиль текущего пользователя.
     *
     * Эта функция работает как для существующих пользователей (редактирование),
     * так и для новых (автоматическое создание при первом сохранении).
     *
     * @param {Object} context - Контекст действия Vuex ({ dispatch, rootGetters })
     * @param {Object} payload - Данные из компонента
     * @param {string} payload.displayName - Имя, введённое пользователем
     * @param {string} payload.avatarUrl - URL аватара (может быть пустой строкой)
     */
    async save({ dispatch, rootGetters }, { displayName, avatarUrl }) {
      // Получаем данные авторизованного пользователя из модуля auth
      const userAuth = rootGetters['auth/user'] // содержит id, email и др. от Firebase Auth
      const email = rootGetters['auth/userEmail'] // удобный геттер для email

      // Защита: если по какой-то причине нет ID пользователя — выходим
      if (!userAuth?.id) {
        showToast.error('Не удалось определить пользователя')
        return
      }

      // Пытаемся найти текущего пользователя в списке всех пользователей по email
      // (данные берутся из модуля users, который хранит кэш из Firebase)
      const currentUser = rootGetters['users/getUserByEmail'](email)

      // Формируем объект с полями, которые нужно обновить или установить
      // (очищаем displayName от лишних пробелов, подстраховываемся от undefined)
      const updatedFields = {
        email: email || '',
        displayName: (displayName || '').trim(), // trim() убирает пробелы по краям
        avatarUrl: avatarUrl || '', // если аватар не загружен — пустая строка
      }

      // Формируем финальный объект данных пользователя для отправки в Firebase:
      // — если пользователь уже существует → мержим старые данные с новыми (сохраняем все поля!)
      // — если нового пользователя → создаём объект с обязательными полями + createdAt
      const userData = currentUser
        ? { ...currentUser, ...updatedFields } // распыляем старый объект и перезаписываем нужное
        : {
            ...updatedFields,
            createdAt: new Date().toISOString(), // фиксируем момент первого сохранения
            // Примеры других полей, которые можно добавить по умолчанию:
            // role: 'user',                    // роль по умолчанию
            // isActive: true,                  // флаг активности
            // settings: { theme: 'light' },    // настройки по умолчанию
          }

      try {
        // Отправляем данные в Firebase через действие из модуля users
        // Используем { root: true }, потому что вызываем action из другого (root) модуля
        await dispatch(
          'users/saveUser',
          {
            id: userAuth.id, // используем Firebase UID как ключ записи
            data: userData, // весь объект пользователя
          },
          { root: true },
        )

        // Показываем разное сообщение в зависимости от того, создали мы профиль или обновили
        const message = currentUser ? 'Профиль обновлён' : 'Добро пожаловать! Профиль создан'
        showToast.success(message)
      } catch (err) {
        // Обработка ошибок сети или Firebase
        showToast.error('Не удалось сохранить профиль')
        console.error('Ошибка сохранения профиля:', err)
      }
    },
  },
}
