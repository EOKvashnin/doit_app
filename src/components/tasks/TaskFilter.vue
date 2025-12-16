<template>
  <div class="w-[90%] mx-auto flex flex-row justify-between gap-5 mb-3">
    <div class="w-110">
      <input type="text" class="input-filter" placeholder="Название" v-model="title" />
    </div>
    <div class="w-110">
      <input type="text" class="input-filter" placeholder="Инициатор" v-model="authorFio" />
    </div>
    <div class="w-110">
      <input type="text" class="input-filter" placeholder="Исполнитель" v-model="assigneeFio" />
    </div>

    <div class="form-control w-110">
      <select class="select-modal" id="status" v-model="priority">
        <option value="">Выберите приоритет</option>
        <option value="urgent">Максимальный</option>
        <option value="high">Высокий</option>
        <option value="medium">Средний</option>
        <option value="low">Низкий</option>
      </select>
    </div>

    <transition name="slide-right">
      <button class="btn w-50" v-if="isActive" @click="reset" type="button">Очистить</button>
    </transition>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'

export default {
  name: 'TasksFilter',
  emits: ['update:modelValue'],
  props: ['modelValue'],
  setup(props, { emit }) {
    const title = ref(props.modelValue?.title || '')
    const authorFio = ref(props.modelValue?.authorFio || '')
    const assigneeFio = ref(props.modelValue?.assigneeFio || '')
    const priority = ref(props.modelValue?.priority || '')

    // Слушаем изменения извне (например, сброс фильтра)
    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal) {
          title.value = newVal.title || ''
          authorFio.value = newVal.authorFio || ''
          assigneeFio.value = newVal.assigneeFio || ''
          priority.value = newVal.priority || ''
        }
      },
      { deep: true },
    )
    const isActive = computed(() => {
      return !!(title.value || authorFio.value || assigneeFio.value || priority.value)
    })

    const reset = () => {
      title.value = ''
      authorFio.value = ''
      assigneeFio.value = ''
      priority.value = ''
    }

    // Эмитим изменения наружу
    watch([title, authorFio, assigneeFio, priority], () => {
      emit('update:modelValue', {
        title: title.value,
        authorFio: authorFio.value,
        assigneeFio: assigneeFio.value,
        priority: priority.value,
      })
    })

    return {
      title,
      authorFio,
      assigneeFio,
      priority,
      reset,
      isActive,
    }
  },
}
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s ease;
  position: relative; /* важно: не absolute! */
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
