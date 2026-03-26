<template>
  <Motion
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.4, ease: 'easeOut' }"
    class="flex flex-col border-r border-gray-300/10"
  >
    <!-- Заголовок колонки -->
    <ColumnHeader
      :title="column.title"
      :icon="column.icon"
      :count="column.count"
      :add-icon="column.addIcon"
      @add-task="onAddTask"
    />

    <!-- Контейнер с задачами -->
    <div
      class="flex-1 overflow-y-auto py-2 scrollable-column pr-3"
      :style="{ maxHeight: `calc(100vh - ${hScrollBlock}px)` }"
    >
      <!-- Пустое состояние -->
      <EmptyColumnState v-if="tasks.length === 0" :icon="column.emptyIcon" />

      <!-- Список задач - сетка для средней колонки -->
      <div
        v-else
        :class="column.layout === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'"
      >
        <Motion
          v-for="(task, index) in tasks"
          :key="task.id"
          :initial="{ opacity: 0, y: 50, scale: 0.95 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :transition="{
            duration: 0.4,
            delay: index * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          }"
          class="h-full"
        >
          <TaskTableCard
            :task="task"
            :get-avatar-by-email="getAvatarByEmail"
            :get-display-name-by-email="getDisplayNameByEmail"
            @open-card="handleOpenCard"
          />
        </Motion>
      </div>
    </div>
  </Motion>
</template>

<script setup>
import { Motion } from 'motion-v'
import ColumnHeader from './ColumnHeader.vue'
import EmptyColumnState from './EmptyColumnState.vue'
import TaskTableCard from './TaskTableCard.vue'

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
  tasks: {
    type: Array,
    required: true,
    default: () => [],
  },
  getAvatarByEmail: {
    type: Function,
    required: true,
  },
  getDisplayNameByEmail: {
    type: Function,
    required: true,
  },
  hScrollBlock: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['open-modal', 'open-card'])

function onAddTask() {
  emit('open-modal', props.column.id)
}

function handleOpenCard(event) {
  emit('open-card', event)
}
</script>
