<template>
  <div class="modal-wrapper">
    <!-- Добавлен корневой элемент -->
    <div class="modal-backdrop" @click.self="close"></div>
    <div class="modal">
      <h3
        class="text-center text-2xl mb-2 font-medium text-gray-500 dark:text-gray-300"
        v-if="title"
      >
        {{ title }}
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>
