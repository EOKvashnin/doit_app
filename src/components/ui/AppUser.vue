<template>
  <span>
    {{ loginFio }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  login: {
    type: String,
    required: true,
    default: '',
  },
})

const loginMap = {
  'eo@mail.ru': 'Квашнин Е.О.',
  'eo_kvashnin@bk.ru': 'Квашнин Е.О. BK.RU',
}

const loginFio = computed(() => loginMap[props.login] || props.login || 'Гость')
</script>
