<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center py-8 mx-auto md:h-screen lg:py-0">
      <div class="relative not-last:flex shrink-0 justify-center items-start gap-3 z-110">
        <Icon icon="streamline-ultimate:space-rocket-earth" class="text-white w-15 h-15 z-110" />
        <header class="z-555">Do it</header>
        <div
          class="absolute -bottom-20 left-1/2 transform -translate-x-1/2 custom-shape w-64 h-64 z-0"
        ></div>
      </div>

      <div
        class="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700 z-999 backdrop-blur-[20px]"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold tracking-tight text-gray-400 text-shadow-xs md:text-2xl dark:text-white text-center"
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
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'

// import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'

import 'vue3-toastify/dist/index.css'

export default {
  components: {
    Icon,
  },
  setup() {
    const route = useRoute()
    if (route.query.message) {
      toast.warning(error(route.query.message))
    }

    return { ...useLoginForm() }
  },
}
</script>
