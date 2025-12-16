import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

export function useTasksForm(fn, initialStatus) {
  const { isSubmitting, handleSubmit } = useForm({
    initialValues: {
      status: initialStatus,
      priority: 'low',
    },
  })

  const {
    value: title,
    errorMessage: ttlError,
    handleBlur: ttlBlur,
  } = useField('title', yup.string().trim().required('Введите название задачи'))
  const {
    value: leadFio,
    errorMessage: leadError,
    handleBlur: leadBlur,
  } = useField('leadFio', yup.string().trim().required('Введите инициатора'))
  const {
    value: assigneeFio,
    errorMessage: asignError,
    handleBlur: asignBlur,
  } = useField('assigneeFio', yup.string().trim().required('Введите исполнителя'))
  const { value: priority } = useField('priority')
  const { value: status } = useField('status')
  const {
    value: deadline,
    errorMessage: dedlError,
    handleBlur: dedlBlur,
  } = useField('deadline', yup.string().trim().required('Введите дедлайн'))
  const {
    value: description,
    errorMessage: dscError,
    handleBlur: dscBlur,
  } = useField('description', yup.string().trim())

  const onSubmit = handleSubmit(fn)

  return {
    isSubmitting,
    onSubmit,
    title,
    ttlError,
    ttlBlur,
    leadFio,
    leadError,
    leadBlur,
    assigneeFio,
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
