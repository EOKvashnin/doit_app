import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

export function useTasksForm(fn, initialStatus) {
  const { isSubmitting, handleSubmit } = useForm({
    initialValues: {
      status: initialStatus,
      priority: 'low',
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
    value: leadEmail,
    errorMessage: leadError,
    handleBlur: leadBlur,
  } = useField(
    'leadEmail',
    yup.string().required('Выберите инициатора').email('Некорректный email'),
  )

  // === Исполнитель (email) ===
  const {
    value: assigneeEmail,
    errorMessage: asignError,
    handleBlur: asignBlur,
  } = useField(
    'assigneeEmail',
    yup.string().required('Выберите исполнителя').email('Некорректный email'),
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

  const onSubmit = handleSubmit(fn)

  return {
    isSubmitting,
    onSubmit,

    // Основные поля
    title,
    ttlError,
    ttlBlur,

    leadEmail,
    leadError,
    leadBlur,

    assigneeEmail,
    asignError,
    asignBlur,

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
