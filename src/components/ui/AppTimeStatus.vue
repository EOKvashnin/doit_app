<template>
  <span :class="className">{{ text }}</span>
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
    text: {
      type: String,
    },
  },

  setup(props) {
    const classMap = {
      appointed: 'time',
      employed: 'nonstyle',
      fired: 'nonstyle',
      refused: 'nonstyle',
      no_contact: 'nonstyle',
      not_suitable: 'nonstyle',
      to_another: 'nonstyle',
      no_show: 'nonstyle',
      thinking: 'nonstyle',
      medical_failed: 'nonstyle',
      medical_referred: 'nonstyle',
    }

    const className = computed(() => classMap[props.type] || 'neutral')
    const text = computed(() => props.text || '')

    return {
      className,
      text,
    }
  },
}
</script>
