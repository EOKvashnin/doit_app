<!-- ConfirmModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="onCancel">
      <div class="modal-confirm">
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button @click="onCancel" class="btn-cancel">Отмена</button>
          <button @click="onConfirm" class="btn-del flex justify-start items-center gap-2">
            <Icon icon="lucide:trash-2" class="w-4 h-4 text-white" />Удалить
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  visible: Boolean,
  message: {
    type: String,
    default: 'Вы уверены?',
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const onConfirm = () => emit('confirm')
const onCancel = () => emit('cancel')
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(1px);
}

.modal-confirm p {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}

.danger {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.danger:hover {
  background: #c82333;
}

.cancel {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.cancel:hover {
  background: #5a6268;
}
</style>
