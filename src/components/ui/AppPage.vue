<template>
  <!-- <div class="breadcrumbs" v-if="back">
    <router-link class="text-white" to="/">Вернуться к списку заявок</router-link>
  </div> -->
  <div class="h-screen flex flex-col items-center justify-start py-3">
    <div class="w-full max-w-[1800px] px-4">
      <div class="w-full max-w-[90%] mx-auto">
        <h1
          class="flex justify-between items-center text-2xl font-medium text-gray-500 dark:text-gray-300 w-full mb-3 all-sm-caps"
        >
          {{ title }}
          <slot name="header"></slot>
        </h1>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    back: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    document.title = `Do it | ${props.title}`
  },
}
</script>

<style scoped></style>
