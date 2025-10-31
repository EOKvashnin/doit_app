<template>
  <component :is="layout + '-layout'" v-if="layout"></component>
</template>

<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import MainLayout from './layout/MainLayout.vue'
import AuthLayout from './layout/AuthLayout.vue'

export default {
  name: 'App',
  components: { MainLayout, AuthLayout },
  setup() {
    const route = useRoute()
    const store = useStore() // ← Вот чего не хватало!

    onMounted(() => {
      if (route.meta.layout !== 'auth') {
        store.dispatch('workers/load').catch(console.error)
      }
    })

    return {
      layout: computed(() => route.meta.layout),
    }
  },
}
</script>
