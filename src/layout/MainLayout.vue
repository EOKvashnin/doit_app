<template>
  <TheNavbar></TheNavbar>

  <router-view></router-view>
</template>

<script>
import TheNavbar from '../components/TheNavbar.vue'

export default {
  components: { TheNavbar },
  setup() {},
}
</script>

<style scoped></style>
