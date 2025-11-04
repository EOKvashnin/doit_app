<template>
  <TheNavbar></TheNavbar>

  <router-view> </router-view>
</template>

<script>
import TheNavbar from '../components/TheNavbar.vue'
import { useRoute } from 'vue-router'
export default {
  components: { TheNavbar },
  setup() {},
}
</script>
