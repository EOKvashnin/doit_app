<template>
  <div class="user-select relative" @click="toggleDropdown">
    <!-- Выбранное значение -->
    <div
      class="select-trigger w-full flex items-center gap-2 p-2 border border-gray-700 rounded-md bg-white dark:bg-gray-800 cursor-pointer text-gray-700 dark:text-white"
    >
      <img
        v-if="selectedUser && selectedUser.avatarUrl"
        :src="selectedUser.avatarUrl"
        alt="avatar"
        class="w-6 h-6 rounded-full object-cover"
      />
      <span v-if="selectedUser">
        {{ selectedUser.displayName }}
      </span>
      <span v-else class="text-gray-400">
        {{ placeholder }}
      </span>
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
        @click="selectUser(user)"
        class="flex items-center gap-2 p-2 hover:bg-gray-300 hover:dark:bg-gray-700 cursor-pointer"
      >
        <img
          v-if="user.avatarUrl"
          :src="user.avatarUrl"
          alt="avatar"
          class="w-6 h-6 rounded-full object-cover"
        />
        <span>{{ user.displayName }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UserSelect',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    users: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Выберите пользователя...',
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    selectedUser() {
      return this.users.find((u) => u.email === this.modelValue) || null
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    selectUser(user) {
      this.$emit('update:modelValue', user.email)
      this.isOpen = false
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
.user-select {
  position: relative;
}

/* Стили скроллбара */
ul::-webkit-scrollbar {
  width: 6px;
}

ul::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5); /* bg-gray-800 с прозрачностью */
}

ul::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.7); /* bg-gray-600 */
  border-radius: 4px;
}

ul::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 1); /* bg-gray-600 */
}
</style>
