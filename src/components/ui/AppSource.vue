<template>
  <span :class="['badge', className]">{{ text }}</span>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    source: {
      type: String,
      required: true,
      default: '',
      validator(value) {
        return [
          'hh',
          'avito',
          'telephone',
          'job_center',
          'news_sputnik',
          'news_prorab',
          'vk',
          'work_in_russia',
          'friend',
          'off_website',
        ].includes(value)
      },
    },
  },

  setup(props) {
    const classMap = {
      hh: 'red',
      avito: 'orange',
      telephone: 'green',
      job_center: 'purple',
      news_sputnik: 'black',
      news_prorab: 'brown',
      vk: 'light-blue',
      work_in_russia: 'dark-green',
      friend: 'yellow',
      off_website: 'grey',
    }

    const textMap = {
      hh: 'Head Hunter',
      avito: 'Авито',
      telephone: 'Телефон',
      job_center: 'Центр занятости',
      news_sputnik: 'Газета Спутник',
      news_prorab: 'Газета Прораб',
      vk: 'ВКонтакте',
      work_in_russia: 'Работа в России',
      friend: 'Привел друг',
      off_website: 'Сайт ЧЛМЗ',
    }
    const className = computed(() => classMap[props.source] || 'neutral')
    const text = computed(() => textMap[props.source] || 'neutral')

    return {
      className,
      text,
    }
  },
}
</script>
