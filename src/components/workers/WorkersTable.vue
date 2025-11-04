<template>
  <h4 v-if="workers.length === 0" class="text-center text-gray-400">Кандидатов пока нет</h4>

  <div v-else class="w-full flex justify-center items-center">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg w-full my-2">
      <table class="w-full text-sm text-gray-500 dark:text-gray-300 table-fixed">
        <colgroup>
          <col class="w-[3%]" />
          <!-- # -->
          <col class="w-[5%]" />
          <!-- Дата -->
          <col class="w-[3%]" />
          <!-- Время -->
          <col class="w-[13%]" />
          <!-- Должность -->
          <col class="w-[13%]" />
          <!-- ФИО -->
          <col class="w-[10%]" />
          <!-- Телефон -->
          <col class="w-[10%]" />
          <!-- Руководитель -->
          <col class="w-[8%]" />
          <!-- Источник -->
          <col class="w-[10%]" />
          <!-- Статус -->
          <col class="w-[8%]" />
          <!-- Дата тр. -->
          <col class="w-[22%]" />
          <!-- Комментарий -->
        </colgroup>
        <thead class="text-xs text-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            <th class="px-1 py-1 text-center">№</th>
            <th class="px-1 py-1">Дата собес-я</th>
            <th class="px-1 py-1">Время</th>
            <th class="px-1 py-1">Должность</th>
            <th class="px-1 py-1">ФИО соискателя</th>
            <th class="px-1 py-1">Телефон соискателя</th>
            <th class="px-1 py-1">ФИО Руководителя</th>
            <th class="px-1 py-1">Площадка-источник</th>
            <th class="px-1 py-1">Текущий статус</th>
            <th class="px-1 py-1">Дата трудоустройства</th>
            <th class="px-1 py-1">Комментарий</th>
          </tr>
        </thead>
      </table>

      <div class="tbody-scrollable max-h-[550px] overflow-y-auto">
        <table class="w-full text-sm text-gray-500 dark:text-gray-300 table-fixed">
          <colgroup>
            <col class="w-[3%]" />
            <!-- # -->
            <col class="w-[5%]" />
            <!-- Дата -->
            <col class="w-[3%]" />
            <!-- Время -->
            <col class="w-[13%]" />
            <!-- Должность -->
            <col class="w-[13%]" />
            <!-- ФИО -->
            <col class="w-[10%]" />
            <!-- Телефон -->
            <col class="w-[10%]" />
            <!-- Руководитель -->
            <col class="w-[8%]" />
            <!-- Источник -->
            <col class="w-[10%]" />
            <!-- Статус -->
            <col class="w-[8%]" />
            <!-- Дата тр. -->
            <col class="w-[22%]" />
            <!-- Комментарий -->
          </colgroup>
          <tbody>
            <tr
              class="tr"
              @click="emitOpenCard(w)"
              v-for="(w, idx) in sortedByDateTimeWorkers"
              :key="w.id"
            >
              <td class="h-10 p-4 align-middle">{{ idx + 1 }}</td>
              <td class="td">{{ formatDateTable(w.int_date) }}</td>
              <td class="td">{{ w.int_time }}</td>
              <td class="td">{{ w.position }}</td>
              <td class="td">{{ w.fio }}</td>
              <td class="td">{{ w.phone }}</td>
              <td class="td">{{ w.fioRuc }}</td>
              <td class="td status-cell"><AppSource :source="w.source" /></td>
              <td class="td text-[10px] status-cell"><AppStatus :type="w.cur_status" /></td>
              <td class="td text-center">{{ formatDateTable(w.employment_Date) }}</td>
              <td class="td">{{ w.note }}</td>
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
  console.log('Worker:', worker)
}

// return { formatDate, emitOpenCard }
</script>
