<template>
  <span :class="['badge', 'truncate-text', className]">{{ text }}</span>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    type: {
      type: String,
      required: true,
      default: '',
      validator(value) {
        return [
          'appointed',
          'employed',
          'fired',
          'refused',
          'no_contact',
          'to_another',
          'not_suitable',
          'no_show',
          'thinking',
          'medical_failed',
          'medical_referred',
        ].includes(value)
      },
    },
  },

  setup(props) {
    const classMap = {
      appointed: 'primary',
      employed: 'success',
      fired: 'end',
      refused: 'neutral',
      no_contact: 'neutral',
      not_suitable: 'neutral',
      to_another: 'secondary',
      no_show: 'neutral',
      thinking: 'warning',
      medical_failed: 'neutral',
      medical_referred: 'warning',
    }

    const textMap = {
      appointed: 'Назначено собеседование',
      employed: 'Трудоустроен(а)',
      fired: 'Уволен(а)',
      refused: 'Отказался',
      to_another: 'Предпочли другого',
      no_contact: 'Не выходит на связь',
      not_suitable: 'Не подходит руководителю',
      no_show: 'Не пришел(ла) на собеседование',
      thinking: 'Ушел думать',
      medical_failed: 'Не прошел медкомиссию',
      medical_referred: 'Направлен на медкомиссию',
    }

    const className = computed(() => classMap[props.type] || 'neutral')
    const text = computed(() => textMap[props.type] || 'Неизвестный статус')

    return {
      className,
      text,
    }
  },
}
</script>
