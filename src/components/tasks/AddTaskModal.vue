<template>
  <form @submit.prevent="onSubmit" class="overflow-y-auto p-3">
    <!-- /* --------- НАЗВАНИЕ ЗАДАЧИ ----------*/ -->
    <div class="form-control" :class="{ invalid: ttlError }">
      <label class="label-modal" for="title">Название задачи</label>
      <input class="input-modal" type="text" id="title" v-model="title" @blur="ttlBlur" />
      <small class="text-pink-500" v-if="ttlError"> {{ ttlError }}</small>
    </div>

    <div class="flex flex-row gap-4">
      <!-- /* --------- ИНИЦИАТОР ----------*/ -->
      <!-- ИНИЦИАТОР -->
      <div class="form-control w-full" :class="{ invalid: leadError }">
        <label class="label-modal" for="leadEmail">Инициатор</label>
        <select class="select-modal" id="leadEmail" v-model="leadEmail" @blur="leadBlur">
          <option value="" disabled selected>Выберите инициатора...</option>
          <option v-for="user in availableUsers" :key="user.email" :value="user.email">
            {{ user.displayName }}
          </option>
        </select>
        <small class="text-pink-500" v-if="leadError"> {{ leadError }}</small>
      </div>

      <!-- ИСПОЛНИТЕЛЬ -->
      <div class="form-control w-full" :class="{ invalid: asignError }">
        <label class="label-modal" for="assigneeEmail">Исполнитель</label>
        <select class="select-modal" id="assigneeEmail" v-model="assigneeEmail" @blur="asignBlur">
          <option value="" disabled selected>Выберите исполнителя...</option>
          <option v-for="user in availableUsers" :key="user.email" :value="user.email">
            {{ user.displayName }}
          </option>
        </select>
        <small class="text-pink-500" v-if="asignError"> {{ asignError }}</small>
      </div>
    </div>

    <div class="flex gap-4">
      <!-- /* ------------- ПРИОРИТЕТ -------------- */ -->
      <div class="form-control w-full">
        <label class="label-modal" for="priority">Приоритет</label>
        <select class="select-modal" id="priority" v-model="priority">
          <option value="urgent">🔴 Максимальный</option>
          <option value="high">🟠 Высокий</option>
          <option value="medium">🟢 Средний</option>
          <option value="low">🟣 Низкий</option>
        </select>
      </div>

      <!-- /* --------- СТАТУС ----------*/ -->
      <div class="form-control w-full">
        <label class="label-modal" for="status">Статус</label>
        <select class="select-modal" id="status" v-model="status">
          <option value="todo">📋 Планируется</option>
          <option value="in_progress">⚙️ В работе</option>
          <option value="review">🔍 Тестирование</option>
          <option value="done">✅ Завершено</option>
        </select>
      </div>

      <!-- /* --------- ДЭДЛАЙН ----------*/ -->

      <div class="form-control w-full" :class="{ invalid: dedlError }">
        <label class="label-modal" for="deadline">Дедлайн</label>
        <input class="input-modal" type="date" id="deadline" v-model="deadline" @blur="dedlBlur" />
        <small class="text-pink-500" v-if="dedlError"> {{ dedlError }}</small>
      </div>
    </div>

    <!-- /* --------- ОПИСАНИЕ ЗАДАЧИ ----------*/ -->
    <div class="form-control mb-3" :class="{ invalid: dscError }">
      <label class="label-modal" for="description">Описание задачи</label>
      <textarea
        rows="3"
        class="area-modal"
        id="description"
        v-model="description"
        @blur="dscBlur"
        placeholder="Описание задачи..."
      ></textarea>

      <small class="text-pink-500" v-if="dscError"> {{ dscError }}</small>
    </div>

    <button type="submit" class="btn-submit" :disabled="isSubmitting">Добавить</button>
  </form>
</template>

<script>
import { useTasksForm } from '@/use/tasks-form'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    initialStatus: {
      type: String,
      default: 'todo',
    },
  },

  emits: ['created'],

  setup(props, { emit }) {
    const store = useStore()

    // Получаем список пользователей
    const availableUsers = computed(() => {
      return store.state.users.allUsers || []
    })

    // Функция отправки
    const submit = async (values) => {
      console.log('Отправка задачи:', values)
      await store.dispatch('tasks/create', values)
      emit('created')
    }

    // Получаем все поля из useTasksForm (включая leadEmail и assigneeEmail!)
    const {
      title,
      description,
      priority,
      status,
      deadline,
      isSubmitting,
      ttlError,
      dscError,
      dedlError,
      ttlBlur,
      dscBlur,
      dedlBlur,

      // 🔥 Вот они — email-поля из vee-validate!
      leadEmail,
      leadError,
      leadBlur,

      assigneeEmail,
      asignError,
      asignBlur,

      onSubmit,
    } = useTasksForm(submit, props.initialStatus)

    return {
      title,
      description,
      priority,
      status,
      deadline,
      isSubmitting,
      ttlError,
      dscError,
      dedlError,
      ttlBlur,
      dscBlur,
      dedlBlur,

      // Возвращаем email-поля
      leadEmail,
      leadError,
      leadBlur,

      assigneeEmail,
      asignError,
      asignBlur,

      onSubmit,
      availableUsers,
    }
  },
}
</script>
