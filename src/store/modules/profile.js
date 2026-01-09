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

    async save({ dispatch, rootGetters }, { displayName, avatarUrl }) {
      const userAuth = rootGetters['auth/user']
      const email = rootGetters['auth/userEmail']

      if (!userAuth?.id) {
        showToast.error('Не удалось определить пользователя')
        return
      }

      // Получаем текущий объект пользователя из store
      const currentUser = rootGetters['users/getUserByEmail'](email)
      if (!currentUser) {
        return
      }

      // Создаём новый объект с обновлёнными полями
      const updatedData = {
        ...currentUser, // копируем все поля
        displayName: (displayName || '').trim(),
        avatarUrl: avatarUrl || '', // если пустой — оставляем как есть
        email: email || '', // обязательно
      }

      try {
        await dispatch(
          'users/saveUser',
          {
            id: userAuth.id,
            data: updatedData,
          },
          { root: true },
        )
      } catch (err) {
        showToast.error('Не удалось сохранить профиль')
      }
    },
  },
}
