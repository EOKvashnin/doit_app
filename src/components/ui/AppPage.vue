<template>
  <!-- <div class="breadcrumbs" v-if="back">
    <router-link class="text-white" to="/">Вернуться к списку заявок</router-link>
  </div> -->
  <div class="w-screen flex items-center justify-center">
    <div class="w-[1600px] flex-col justify-center items-start pt-3">
      <div class="w-[1216px] mx-auto flex justify-center items-start">
        <h1
          class="text-2xl text-gray-400 font-light flex items-center justify-between w-full mb-3 all-sm-caps"
        >
          {{ title }} <slot name="header"></slot>
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
    document.title = `${props.title} | Power Staff`
  },
}
</script>

<style scoped></style>
