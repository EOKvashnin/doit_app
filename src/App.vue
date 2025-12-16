<template>
  <component :is="layout + '-layout'" v-if="layout"></component>
</template>

<script>
import AuthLayout from '@/layout/AuthLayout.vue'
import MainLayout from '@/layout/MainLayout.vue'

export default {
  name: 'App',
  components: { AuthLayout, MainLayout },
}
</script>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const layout = computed(() => route.meta.layout)
</script>
