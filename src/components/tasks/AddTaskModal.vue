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
      <div class="form-control w-full" :class="{ invalid: leadError }">
        <label class="label-modal" for="leadFio">Инициатор</label>
        <input class="input-modal" type="text" id="leadFio" v-model="leadFio" @blur="leadBlur" />
        <small class="text-pink-500" v-if="leadError"> {{ leadError }}</small>
      </div>

      <!-- /* --------- ИСПОЛНИТЕЛЬ ----------*/ -->
      <div class="form-control w-full" :class="{ invalid: asignError }">
        <label class="label-modal" for="assigneeFio">Исполнитель</label>
        <input
          class="input-modal"
          type="text"
          id="assigneeFio"
          v-model="assigneeFio"
          @blur="asignBlur"
        />
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
    const submit = async (values) => {
      await store.dispatch('tasks/create', values)
      emit('created')
    }

    return {
      ...useTasksForm(submit, props.initialStatus),
    }
  },
}
</script>
