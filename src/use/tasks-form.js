import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

export function useTasksForm(fn, initialStatus) {
  const { isSubmitting, handleSubmit } = useForm({
    initialValues: {
      status: initialStatus,
      priority: 'low',
      executors: [],
    },
  })

  // === Название задачи ===
  const {
    value: title,
    errorMessage: ttlError,
    handleBlur: ttlBlur,
  } = useField('title', yup.string().trim().required('Введите название задачи'))

  // === Инициатор (email) ===
  const {
    value: initiatorEmail,
    errorMessage: initiatorError,
    handleBlur: initiatorBlur,
  } = useField(
    'initiatorEmail',
    yup.string().required('Выберите инициатора').email('Некорректный email'),
  )

  // === Исполнители (массив email'ов) ===
  const {
    value: executors,
    errorMessage: executorsError,
    handleBlur: executorsBlur,
  } = useField(
    'executors',
    yup
      .array()
      .of(yup.string().email('Некорректный email'))
      .min(1, 'Выберите хотя бы одного исполнителя')
      .required('Выберите исполнителя'),
  )

  // === Приоритет и статус ===
  const { value: priority } = useField('priority')
  const { value: status } = useField('status')

  // === Дедлайн ===
  const {
    value: deadline,
    errorMessage: dedlError,
    handleBlur: dedlBlur,
  } = useField('deadline', yup.string().required('Введите дедлайн'))

  // === Описание ===
  const {
    value: description,
    errorMessage: dscError,
    handleBlur: dscBlur,
  } = useField('description', yup.string().trim())

  // ✅ Теперь onSubmit не нуждается в преобразовании!
  const onSubmit = handleSubmit(fn)

  return {
    isSubmitting,
    onSubmit,

    // Основные поля
    title,
    ttlError,
    ttlBlur,

    // ✅ НОВЫЕ ИМЕНА
    initiatorEmail,
    initiatorError,
    initiatorBlur,

    executors,
    executorsError,
    executorsBlur,

    priority,
    status,
    deadline,
    dedlError,
    dedlBlur,
    description,
    dscError,
    dscBlur,
  }
}
