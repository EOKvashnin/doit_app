import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

export function useWorkerForm(fn) {
  const { handleSubmit, isSubmitting } = useForm({
    initialValues: {
      cur_status: 'appointed',
      source: 'hh',
      special_notes: 'none',
    },
  })

  // Дата собеседования
  const {
    value: int_date,
    errorMessage: idError,
    handleBlur: idBlur,
  } = useField('int_date', yup.string().trim().required('Введите дату собеседования'))

  // Время собеседования
  const {
    value: int_time,
    errorMessage: itError,
    handleBlur: itBlur,
  } = useField('int_time', yup.string().trim().required('Введите время собеседования'))

  // ФИО соискателя
  const {
    value: fio,
    errorMessage: fioError,
    handleBlur: fioBlur,
  } = useField('fio', yup.string().trim().required('Введите ФИО соискателя'))

  // Телефон соискателя
  const {
    value: phone,
    errorMessage: phError,
    handleBlur: phBlur,
  } = useField(
    'phone',
    yup
      .string()
      .trim()
      .required('Введите номер телефона')
      .test('phone-format', 'Некорректный формат телефона', (value) => {
        if (!value) return false
        // Проверка, что все символы заполнены (нет подчеркиваний)
        return !value.includes('_') && value.replace(/\D/g, '').length === 11
      }),
  )

  // ФИО руководителя
  const {
    value: fioRuc,
    errorMessage: frError,
    handleBlur: frBlur,
  } = useField('fioRuc', yup.string().trim().required('Введите ФИО руководителя'))

  // Площадка-источник
  const { value: source } = useField('source')

  // Должность
  const {
    value: position,
    errorMessage: posError,
    handleBlur: posBlur,
  } = useField('position', yup.string().trim().required('Введите должность'))

  // Статус
  const { value: cur_status } = useField('cur_status')

  // Дата трудоустройства
  const {
    value: employment_Date,
    errorMessage: deError,
    handleBlur: deBlur,
  } = useField(
    'employment_Date',
    yup.string().when('cur_status', {
      is: 'employed',
      then: (schema) => schema.required('Введите дату трудоустройства'),
      otherwise: (schema) => schema.notRequired(),
    }),
  )

  // Особые отметки
  const { value: special_notes } = useField('special_notes')

  // Комментарий
  const {
    value: note,
    errorMessage: noteError,
    handleBlur: noteBlur,
  } = useField('note', yup.string().trim())

  const onSubmit = handleSubmit(fn)

  return {
    // Форма
    isSubmitting,
    onSubmit,

    // Поля
    int_date,
    idError,
    idBlur,

    int_time,
    itError,
    itBlur,

    fio,
    fioError,
    fioBlur,

    phone,
    phError,
    phBlur,

    fioRuc,
    frError,
    frBlur,

    source,

    position,
    posError,
    posBlur,

    cur_status,

    employment_Date,
    deError,
    deBlur,

    special_notes,

    note,
    noteError,
    noteBlur,
  }
}
