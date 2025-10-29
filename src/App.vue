<template>
  <component :is="layout + '-layout'" v-if="layout"></component>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import AuthPage from './views/AuthPage.vue'
import MainLayout from './layout/MainLayout.vue'
import AuthLayout from './layout/AuthLayout.vue'

export default {
  components: { MainLayout, AuthLayout, AuthPage },
  setup() {
    const route = useRoute()

    return {
      layout: computed(() => route.meta.layout),
    }
  },
}
</script>
