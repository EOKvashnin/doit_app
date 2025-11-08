<template>
  <h4 v-if="workers.length === 0" class="text-center text-gray-400">Кандидатов пока нет</h4>

  <div v-else class="w-full overflow-hidden">
    <!-- Обёртка с прокруткой по горизонтали на случай узких экранов -->
    <div class="overflow-x-auto">
      <!-- Основная таблица -->
      <div class="max-h-screen overflow-y-auto">
        <table class="w-full text-sm text-gray-700 dark:text-gray-300 table-fixed">
          <colgroup>
            <col style="width: 3%" />
            <col style="width: 5%" />
            <col style="width: 4%" />
            <col style="width: 10%" />
            <col style="width: 13%" />
            <col style="width: 7%" />
            <col style="width: 15%" />
            <col style="width: 9%" />
            <col style="width: 10%" />
            <col style="width: 30%" />
          </colgroup>
          <thead
            class="text-xs text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 sticky top-0 z-10"
          >
            <tr>
              <th class="px-1 py-1 text-center">№</th>
              <th class="px-1 py-1 text-left">Дата собес-я</th>
              <th class="px-1 py-1">Время</th>
              <th class="px-1 py-1 text-left">Должность</th>
              <th class="px-1 py-1 text-left">ФИО кандидата</th>
              <th class="px-1 py-1 text-left">Телефон</th>
              <th class="px-1 py-1 text-left">ФИО Руководителя</th>
              <th class="px-1 py-1 text-left">Площадка-источник</th>
              <th class="px-1 py-1 text-left">Текущий статус</th>
              <th class="py-1 px-3 text-left">Комментарий</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="tr border-b hover:bg-gray-50"
              @click="emitOpenCard(w)"
              v-for="(w, idx) in sortedByDateTimeWorkers"
              :key="w.id"
            >
              <td class="p-4 align-middle">{{ idx + 1 }}</td>
              <td class="td p-1">{{ formatDateTable(w.int_date) }}</td>
              <td class="td p-1 text-center">
                <AppTimeStatus :type="w.cur_status" :text="w.int_time" />
              </td>
              <td class="td p-1">{{ w.position }}</td>
              <td class="td p-1">{{ w.fio }}</td>
              <td class="td p-1">{{ w.phone }}</td>
              <td class="td p-1">{{ w.fioRuc }}</td>
              <td class="td p-1 status-cell relative"><AppSource :source="w.source" /></td>
              <td class="td p-1 status-cell relative not-odd:text-[10px]">
                <AppStatus :type="w.cur_status" />
              </td>

              <td class="td-note py-1">{{ w.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppStatus from '../ui/AppStatus.vue'
import AppSource from '../ui/AppSource.vue'
import AppTimeStatus from '../ui/AppTimeStatus.vue'
import formatDateTable from '@/utils/formatDateTable'
import { computed } from 'vue'

const props = defineProps({ workers: Array })
const emit = defineEmits(['open-card'])

const sortedByDateTimeWorkers = computed(() => {
  return [...props.workers].sort((a, b) => {
    // 1. Сравниваем даты
    const dateComparison = b.int_date.localeCompare(a.int_date)

    // 2. Если даты разные сразу возвращаем результат
    if (dateComparison !== 0) {
      return dateComparison
    }
    // 3. Если даты одинаковые сравниваем по времени
    // Но, так как даты записаны в формат "9:00", а не "09:00" надо привести их к числовому формату
    const [hA, mA] = a.int_time.split(':').map(Number)
    const minutesA = hA * 60 + mA

    const [hB, mB] = b.int_time.split(':').map(Number)
    const minutesB = hB * 60 + mB

    return minutesA - minutesB
  })
})

function emitOpenCard(worker) {
  emit('open-card', worker)
}

// return { formatDate, emitOpenCard }
</script>

<style scoped>
.scroller {
  height: 100%;
}
</style>
