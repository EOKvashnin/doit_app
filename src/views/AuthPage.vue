<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="relative flex flex-col items-center justify-center py-8 mx-auto md:h-screen lg:py-0"
    >
      <!-- Фоновый заголовок: всегда за формой и не "прыгает" от разрешения -->
      <div
        id="title"
        class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <h1
          class="text-gradient font-bold uppercase leading-none opacity-80 transform -translate-y-[105%]"
          style="font-size: clamp(64px, 14vw, 180px)"
        >
          Do it
        </h1>
      </div>

      <div
        id="form"
        class="relative z-10 w-full rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700 backdrop-blur-[10px]"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold tracking-tight text-gray-500 text-shadow-xs md:text-2xl dark:text-white text-center"
          >
            Войдите в учетную запись
          </h1>
          <form class="space-y-4 md:space-y-3" @submit.prevent="onSubmit">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Введите e-mail</label
              >
              <input
                type="email"
                name="email"
                id="email"
                autocomplete="username"
                :class="['input-gray', { invalid: eError }]"
                v-model="email"
                @blur="eBlur"
                placeholder="name@company.com"
              />
              <!-- /* Использование текста заглушки для бронирования места в DOM */ -->
              <small class="text-indigo-600" :class="{ invisible: !eError }">{{
                eError || '&nbsp;'
              }}</small>
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Пароль</label
              >
              <input
                type="password"
                name="password"
                id="password"
                autocomplete="current-password"
                placeholder="••••••••"
                :class="['input-gray', { invalid: pError }]"
                v-model="password"
                @blur="pBlur"
              />
              <!-- /* Использование текста заглушки для бронирования места в DOM */ -->
              <small class="text-indigo-600" :class="{ invisible: !pError }">{{
                pError || '&nbsp;'
              }}</small>
            </div>

            <button
              type="submit"
              class="btn-submit transition-color duration-200"
              :disabled="isSubmitting || isTooManyAttempts"
            >
              Войти
            </button>
            <small class="text-center text-indigo-600" v-if="isTooManyAttempts">
              Вы слишком часто пытаетесь войти в систему. Попробуйте через 7 минут
            </small>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useLoginForm } from '@/use/login-form'
import error from '@/utils/error'
import { useRoute } from 'vue-router'

export default {
  components: {},
  setup() {
    const route = useRoute()
    if (route.query.message) {
      console.log(error(route.query.message))
    }

    return { ...useLoginForm() }
  },
}
</script>
<style scoped>
.login-bg {
  background-image: url('/LightWall.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
