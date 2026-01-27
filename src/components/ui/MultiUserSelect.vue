<template>
  <div class="multi-user-select relative" @click="toggleDropdown">
    <!-- Триггер: отображение выбранных -->
    <div
      class="select-trigger w-full flex flex-wrap items-center gap-1 p-2 border border-gray-700 rounded-md bg-white dark:bg-gray-800 cursor-pointer text-white min-h-[40px]"
    >
      <span v-if="selectedUsers.length === 0" class="text-gray-400">
        {{ placeholder }}
      </span>

      <!-- Отображаем аватарки выбранных -->
      <div v-for="user in visibleSelectedUsers" :key="user.email" class="flex items-center gap-1">
        <img
          v-if="user.avatarUrl"
          :src="user.avatarUrl"
          alt="avatar"
          class="w-6 h-6 rounded-full object-cover"
        />
        <span class="text-gray-700 dark:text-gray-100 text-xs">{{ user.displayName }}</span>
      </div>

      <!-- Если выбрано много — показываем "+N" -->
      <span
        v-if="selectedUsers.length > maxVisible"
        class="text-gray-700 dark:text-gray-400 text-sm"
      >
        +{{ selectedUsers.length - maxVisible }}
      </span>

      <!-- Стрелка -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 ml-auto text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Выпадающий список -->
    <ul
      v-if="isOpen"
      class="absolute z-10 mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto text-gray-700 dark:text-white"
    >
      <li
        v-for="user in users"
        :key="user.email"
        class="flex items-center gap-2 p-2 hover:bg-gray-300 hover:dark:bg-gray-700"
      >
        <input
          type="checkbox"
          :checked="isSelected(user.email)"
          @click.stop="toggleUser(user)"
          class="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 cursor-pointer"
        />
        <img
          v-if="user.avatarUrl"
          :src="user.avatarUrl"
          alt="avatar"
          class="w-6 h-6 rounded-full object-cover"
        />
        <span class="cursor-pointer" @click.stop="toggleUser(user)">
          {{ user.displayName }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MultiUserSelect',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    users: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Выберите исполнителей...',
    },
    maxVisible: {
      type: Number,
      default: 4, // сколько аватарок показывать в триггере
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    selectedUsers() {
      return this.users.filter((user) => this.modelValue.includes(user.email))
    },
    visibleSelectedUsers() {
      return this.selectedUsers.slice(0, this.maxVisible)
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    handleItemClick(event, user) {
      // Если кликнули НЕ по чекбоксу — вызываем toggleUser
      if (event.target.tagName !== 'INPUT') {
        this.toggleUser(user)
      }
    },
    toggleUser(user) {
      const email = user.email
      let newSelection = Array.isArray(this.modelValue) ? [...this.modelValue] : []
      const index = newSelection.indexOf(email)

      if (index === -1) {
        newSelection.push(email)
      } else {
        newSelection.splice(index, 1)
      }

      this.$emit('update:modelValue', newSelection)
    },
    isSelected(email) {
      return this.modelValue.includes(email)
    },
    close() {
      this.isOpen = false
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.close()
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>

<style scoped>
.multi-user-select {
  position: relative;
}

/* Стили скроллбара */
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
}
ul::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.7);
  border-radius: 4px;
}
ul::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 1);
}
</style>
