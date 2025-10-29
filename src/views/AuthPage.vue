<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <header>Power <mark>staff</mark></header>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 mb-30"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl dark:text-white text-center"
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
                :class="['input-gray', { invalid: eError }]"
                v-model="email"
                @blur="eBlur"
                placeholder="name@company.com"
              />
              <!-- /* Использование текста заглушки для бронирования места в DOM */ -->
              <small class="text-pink-500" :class="{ invisible: !eError }">{{
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
                placeholder="••••••••"
                :class="['input-gray', { invalid: pError }]"
                v-model="password"
                @blur="pBlur"
              />
              <!-- /* Использование текста заглушки для бронирования места в DOM */ -->
              <small class="text-pink-500" :class="{ invisible: !pError }">{{
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
            <small class="text-center text-pink-500" v-if="isTooManyAttempts">
              Вы слишком часто пытаетесь войти в систему. Попробуйте через 7 минут
            </small>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRoute } from 'vue-router'
import { useLoginForm } from '@/use/login-form'
import { useToast } from 'vue-toast-notification'
import error from '@/utils/error'
import 'vue3-toastify/dist/index.css'

export default {
  setup() {
    const router = useRoute()

    const toast = useToast()

    if (router.query.message) {
      toast.warning(error(router.query.message), {
        transition: 'flip',
        position: 'top-right',
        duration: 8000,
      })
    }

    return { ...useLoginForm() }
  },
}
</script>
