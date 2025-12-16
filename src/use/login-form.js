import { useField, useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as yup from 'yup'

export function useLoginForm() {
  const store = useStore()
  const router = useRouter()
  const { handleSubmit, isSubmitting, submitCount } = useForm()
  const {
    value: email,
    errorMessage: eError,
    handleBlur: eBlur,
  } = useField(
    'email',
    yup.string().trim().required('Введите email').email('Введите корректный email'),
  )

  const {
    value: password,
    errorMessage: pError,
    handleBlur: pBlur,
  } = useField(
    'password',
    yup.string().trim().required('Введите пароль').min(6, 'Пароль не может быть меньше 6 символов'),
  )

  const isTooManyAttempts = computed(() => submitCount.value > 3)
  watch(isTooManyAttempts, (val) => {
    if (val) {
      setTimeout(() => (submitCount.value = 0), 7000)
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    await store.dispatch('auth/login', values)
    router.push('/')
    console.log('Form:', values)
  })

  return {
    email,
    eError,
    eBlur,
    password,
    pError,
    pBlur,
    onSubmit,
    isSubmitting,
    isTooManyAttempts,
  }
}
