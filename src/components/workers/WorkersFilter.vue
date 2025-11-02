<template>
  <div class="flex flex-row gap-5 mb-3">
    <div class="w-100">
      <input type="text" class="input-filter" placeholder="ФИО кандидата" v-model="fio" />
    </div>
    <div class="w-100">
      <input type="text" class="input-filter" placeholder="Должность" v-model="position" />
    </div>
    <div class="w-100">
      <input type="text" class="input-filter" placeholder="ФИО руководителя" v-model="boss" />
    </div>

    <div class="form-control w-100">
      <select class="select-modal" id="status" v-model="status">
        <option value="">Выберите статус</option>
        <option value="appointed">Назначено собеседование</option>
        <option value="employed">Трудоустроен(а)</option>
        <option value="fired">Уволен(а)</option>
        <option value="refused">Отказался</option>
        <option value="to_another">Предпочтение другому</option>
        <option value="no_contact">Не выходит на связь</option>
        <option value="not_suitable">Не подходит руководителю</option>
        <option value="no_show">Не пришел(ла) на собеседование</option>
        <option value="thinking">Ушел думать</option>
        <option value="medical_failed">Не прошел медкомиссию</option>
        <option value="medical_referred">Направлен на медкомиссию</option>
      </select>
    </div>

    <transition name="slide-right">
      <button class="btn w-50" v-if="isActive" @click="reset" type="button">Очистить</button>
    </transition>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue'

export default {
  name: 'WorkersFilter',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const fio = ref('')
    const position = ref('')
    const boss = ref('')
    const status = ref('')

    // Безопасная инициализация значений из props
    onMounted(() => {
      try {
        if (props.modelValue && typeof props.modelValue === 'object') {
          fio.value = props.modelValue.fio || ''
          position.value = props.modelValue.position || ''
          boss.value = props.modelValue.boss || ''
          status.value = props.modelValue.status || ''
        }
      } catch (error) {
        console.error('Error initializing filter values:', error)
        // Сброс значений в случае ошибки
        fio.value = ''
        position.value = ''
        boss.value = ''
        status.value = ''
      }
    })

    // Исправленный watcher с обработкой ошибок
    watch([fio, position, boss, status], (newValues) => {
      try {
        const [newFio, newPosition, newBoss, newStatus] = newValues

        const filterValue = {
          fio: newFio || '',
          position: newPosition || '',
          boss: newBoss || '',
          status: newStatus || '',
        }

        emit('update:modelValue', filterValue)
      } catch (error) {
        console.error('Error in filter watcher:', error)
      }
    })

    const reset = () => {
      fio.value = ''
      position.value = ''
      boss.value = ''
      status.value = ''
    }

    const isActive = computed(() => {
      return !!(fio.value || position.value || boss.value || status.value)
    })

    return {
      fio,
      position,
      boss,
      status,
      isActive,
      reset,
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
