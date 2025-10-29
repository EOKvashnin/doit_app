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
    yup.string().trim().required('Введите email').email('Введите корректный email адрес через @'),
  )

  const PASS_MIN_LENGTH = 5

  const {
    value: password,
    errorMessage: pError,
    handleBlur: pBlur,
  } = useField(
    'password',
    yup
      .string()
      .trim()
      .required('Введите пароль')
      .min(PASS_MIN_LENGTH, `пароль не может быть меньше ${PASS_MIN_LENGTH} символов`),
  )

  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log('Form:', values)
      await store.dispatch('auth/login', values)
      router.push('/')
    } catch (e) {
      console.log(e)
    }
  })

  const isTooManyAttempts = computed(() => submitCount.value >= 3)

  watch(isTooManyAttempts, (val) => {
    if (val) {
      setTimeout(() => (submitCount.value = 0), 20000) // Обнуляем количество попыток входа
    }
  })

  return {
    email,
    password,
    eError,
    eBlur,
    pError,
    pBlur,
    onSubmit,
    isSubmitting,
    submitCount,
    isTooManyAttempts,
  }
}
