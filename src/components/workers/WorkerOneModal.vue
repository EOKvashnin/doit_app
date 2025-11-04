<template>
  <div class="adaptive-modal scroll-always">
    <div
      v-if="workerData"
      class="w-full border border-gray-500/30 rounded-xl p-4 mt-4 h-8/10 max-h-[550px]"
    >
      <!--/*--------- БЛОК_ФИО ТЕЛЕФОН СТАТУС ----------*/ -->

      <div class="grid grid-cols-[8fr_0.5fr_3fr]">
        <!--/*--------- ФИО ----------*/ -->
        <div class="flex flex-row items-center gap-2">
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          <input class="input-modal-edit w-sm" type="text" id="fio" v-model="fioEditable" />
        </div>
        <!--/*--------- LOADER для изменения статуса ----------*/ -->
        <div class="flex items-center justify-center" style="min-width: 24px; min-height: 24px">
          <AppSmallLoader v-if="isLoadStatus" />
        </div>

        <!--/*--------- СТАТУС ----------*/ -->
        <p class="flex items-center">
          <app-status :type="workerData.cur_status"></app-status>
        </p>
      </div>
      <div class="grid grid-cols-[5fr_2fr]">
        <!--/*--------- БЛОК ТЕЛЕФОН / ДАТА_ТРУДОУСТРОЙСТВА ----------*/ -->
        <div class="flex flex-row items-center my-1 gap-2">
          <!--/*---------ТЕЛЕФОН ----------*/ -->
          <svg
            class="w-6 h-6 text-gray-800 dark:text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 15h12M6 6h12m-6 12h.01M7 21h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1Z"
            />
          </svg>
          <input
            class="input-modal-edit w-sm"
            type="text"
            v-model="phoneEditable"
            v-mask="'+7 (###) ###-##-##'"
            @input="onPhoneInput"
            placeholder="+7 (___) ___-__-__"
          />
        </div>

        <!--/*--------- ДАТА ТРУДОУСТРОЙСТВА ----------*/ -->
        <div
          v-if="workerData?.cur_status === 'employed'"
          class="flex flex-row items-center justify-center gap-2 my-1"
        >
          <svg
            class="w-6 h-6 text-gray-800 dark:text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
            />
          </svg>

          <p class="text-gray-400 text-lg">{{ formatDate(workerData?.employment_Date) }}</p>
        </div>
      </div>
      <div class="w-1/3 flex flex-row items-center justify-center gap-3.5 my-1">
        <svg
          class="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87 1.07 1.413 2.075 1.228 3.192 2.644 1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58 1.402.693 2.918.351 2.918 2.334 0 .276 0 2.008 1.972 2.008 2.026.031 2.026-1.678 2.026-2.008 0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <app-source :source="workerData.source"></app-source>
      </div>
    </div>

    <!--/*------------------- БЛОК ДАТА ТРУДОУСТРОЙСТВА / СПЕЦИАЛЬНОСТЬ / РУКОВОДИТЕЛЬ -------------------*/ -->

    <div v-if="workerData" class="w-full border border-gray-500/30 rounded-xl p-4 mt-4">
      <div class="flex flex-col gap-2">
        <!--/*--- ДАТА/ВРЕМЯ СОБЕСЕДОВАНИЯ ---*/ -->
        <div class="flex-col items-center gap-2">
          <label class="label-modal-edit" for="int_dateEditable">Дата/время собеседования</label>

          <div class="flex gap-4">
            <!--/*--- ДАТА СОБЕСЕДОВАНИЯ ---*/ -->
            <input
              class="input-modal-edit"
              type="date"
              id="int_dateEditable"
              v-model="int_dateEditable"
            />
            <!--/*--- ВРЕМЯ СОБЕСЕДОВАНИЯ ---*/ -->
            <input
              class="input-modal-edit"
              type="time"
              id="int_timeEditable"
              v-model="int_timeEditable"
            />
          </div>
        </div>

        <!--/*--- ГРУППА ДОЛЖНОСТЬ/РУКОВОДИТЕЛЬ ---*/ -->
        <div class="wrapper flex flex-row justify-between gap-4">
          <!--/*--- ДОЛЖНОСТЬ ---*/ -->
          <span class="flex flex-col w-1/2 justify-start">
            <label class="label-modal-edit" for="position">Должность</label>
            <textarea
              class="input-modal-edit"
              type="text"
              rows="3"
              id="positionEditable"
              v-model="positionEditable"
            />
          </span>

          <!--/*--- РУКОВОДИТЕЛЬ ---*/ -->
          <span class="flex flex-col w-1/2 justify-start">
            <label class="label-modal-edit" for="fioRucEditable">ФИО Руководителя</label>
            <textarea
              class="input-modal-edit"
              type="text"
              rows="3"
              id="fioRucEditable"
              v-model="fioRucEditable"
            />
          </span>
        </div>
      </div>
    </div>

    <!--/*------------------- БЛОК ОПИСАНИЕ -------------------*/ -->

    <div v-if="worker" class="w-full border border-gray-500/30 rounded-xl p-4 my-4">
      <h3 class="text-lg text-gray-300">{{ workerData?.note }}</h3>
    </div>

    <!-------------------- БЛОК КОММЕНТАРИЕВ ----------------------->

    <transition-group tag="div" name="list" appear="">
      <div
        v-for="comment in workerData.comment"
        :key="comment.id"
        class="bg-gray-700/30 rounded-xl py-2 px-3 w-fit ml-auto mb-3"
      >
        <li class="flex flex-col justify-center items-end">
          <span class="text-gray-500 text-xs mb-1">{{ formatDateTime(comment.date) }}</span>
          <p class="text-gray-200 text-sm text-right">{{ comment.text }}</p>
        </li>
      </div>
    </transition-group>

    <!-------------------- БЛОК ADD COMMENT ----------------------->
    <transition name="addComment">
      <div v-if="isCommentShow" id="addComment" class="w-full flex flex-row justify-end mt-3">
        <textarea
          rows="3"
          class="area-modal mr-3"
          v-model="commentText"
          id="note"
          placeholder="Комментарий..."
        ></textarea>

        <div class="flex flex-col gap-2 justify-start">
          <button
            @click="toggleShowComment"
            class="flex flex-row gap-2 px-4 py-1 border border-gray-500/30 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Отменить
          </button>
          <button
            @click="addComment"
            class="flex flex-row gap-2 px-4 py-1.5 border border-gray-500/30 text-white rounded hover:bg-pink-600 transition-colors"
          >
            Добавить
          </button>
        </div>
      </div>
    </transition>

    <!--/*--------- КНОПКА ДОБАВЛЕНИЯ КОММЕНТАРИЯ ----------*/ -->
    <div class="flex w-full justify-end">
      <transition name="addBtn" mode="in-out">
        <button @click="toggleShowComment" v-if="!isCommentShow" class="px-2 my-2">
          <svg
            class="w-6 h-6 text-gray-800 dark:text-gray-300 hover:text-pink-500 transition-colors"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
            />
          </svg></button
      ></transition>
    </div>
    <!----------------------- FOOTER -------------------------------->

    <transition name="footer" mode="out-in">
      <div
        class="mt-2 py-3 px-3 rounded-xl flex justify-end items-center gap-3 bottom-0 z-10 bg-gray-800/80"
      >
        <button class="btn-del flex justify-start items-center gap-2" @click="removeWithConfirm">
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 12h4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          Удалить
        </button>
        <div class="form-control w-full">
          <select
            class="select-modal"
            id="cur_status"
            @change="handleSelectChange($event.target.value)"
          >
            <option value="" disabled selected hidden>Обновить статус</option>
            <option value="appointed">Назначено собеседование</option>
            <option value="employed">Трудоустроен(а)</option>
            <option value="fired">Уволен(а)</option>
            <option value="refused">Отказался</option>
            <option value="to_another">Предпочтение другому</option>
            <option value="no_contact">Не выходит на связь</option>
            <option value="not_suitable">Не подходит руководителю</option>
            <option value="no_show">Не пришел(ла) на собеседование</option>
            <option value="thinking">Ушел думать</option>
            <option value="medical_failed">Не прошел медкомиссию</option>
            <option value="medical_referred">Направлен на медкомиссию</option>
          </select>
        </div>
        <transition name="input-width">
          <div v-if="isNeedAddDateEmployment" class="input-wrapper">
            <input
              class="input-modal"
              type="date"
              id="new_employment_Date"
              v-model="new_employment_Date"
              @change="onDateChange"
            />
          </div>
        </transition>
        <transition name="slide-fade">
          <div v-if="hasChanges" class="inline-block">
            <button @click="UpdateWorkerData" class="btn">Обновить</button>
          </div>
        </transition>
        <button @click="onClose" class="btn">Закрыть</button>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { mask } from 'vue-the-mask'
import { useStore } from 'vuex'
import { showToast } from '@/utils/toast'
import { formatDateTime } from '@/utils/formatDate'
import { phoneSchema } from '@/use/change-phone'
import { normalizePhoneForServer } from '@/utils/phone'
import { formatPhoneForInput } from '@/utils/phone'
import AppStatus from '../ui/AppStatus.vue'
import AppSmallLoader from '../ui/AppSmallLoader.vue'
import AppSource from '../ui/AppSource.vue'
import formatDate from '@/utils/formatDate'

export default {
  directives: { mask },
  name: 'WorkerOneModal',
  components: {
    AppStatus,
    AppSmallLoader,
    AppSource,
  },
  props: {
    worker: Object,
  },
  emits: ['openCard', 'workerUpdated', 'close'],
  setup(props, { emit }) {
    const store = useStore()
    const isLoadStatus = ref(false)
    const isNeedAddDateEmployment = ref(false)
    const new_employment_Date = ref('')

    // Локальная реактивная копия данных кандидата
    // Работаем с копией чтобы не мутировать props напрямую
    const workerData = ref(null)
    const fioEditable = ref('')
    const phoneEditable = ref('')
    const int_dateEditable = ref('')
    const int_timeEditable = ref('')
    const positionEditable = ref('')
    const fioRucEditable = ref('')

    // Состояние видимости формы комментария
    const isCommentShow = ref(false)

    // Текст нового комментария
    const commentText = ref('')

    // Следим за изменениями входящих props
    // Создаем глубокую копию для избежания мутаций исходных данных
    watch(
      () => props.worker,
      (newWorker) => {
        if (newWorker) {
          workerData.value = { ...newWorker }
          fioEditable.value = newWorker.fio || ''
          phoneEditable.value = formatPhoneForInput(newWorker.phone || '')
          int_dateEditable.value = newWorker.int_date || ''
          int_timeEditable.value = newWorker.int_time || ''
          positionEditable.value = newWorker.position || ''
          fioRucEditable.value = newWorker.fioRuc || ''
        } else {
          workerData.value = null
          fioEditable.value = ''
          phoneEditable.value = ''
          int_dateEditable.value = ''
          int_timeEditable.value = ''
          positionEditable.value = ''
          fioRucEditable.value = ''
        }
      },
      { immediate: true },
    )

    // Переключение видимости формы комментария
    const toggleShowComment = () => {
      isCommentShow.value = !isCommentShow.value
      // Очищаем поле при закрытии формы
      if (!isCommentShow.value) {
        commentText.value = ''
      }
    }

    // ------------ ДОБАВЛЕНИЕ_НОВОГО_КОММЕНТАРИЯ ------------------

    const addComment = async () => {
      // Валидация - не позволяем отправить пустой комментарий
      if (!commentText.value.trim()) {
        showToast.warning('Добавьте комментарий')
        return
      }

      try {
        // Создаем объект комментария с уникальным ID и меткой времени
        const newComment = {
          id: Date.now(), // Уникальный ID на основе времени
          text: commentText.value.trim(),
          date: new Date().toISOString(), // ISO формат для универсальности
          author: 'Менеджер', // В будущем можно брать из store авторизации
        }

        // Подготавливаем обновленные данные кандидата
        const updatedWorker = {
          ...workerData.value,
          // Иммутабельное обновление массива комментариев
          comment: workerData.value.comment
            ? [...workerData.value.comment, newComment] // Добавляем к существующим
            : [newComment], // Создаем новый массив если комментариев нет
        }

        // Трехэтапная стратегия обновления данных:
        // 1. Мгновенное локальное обновление для отзывчивого UI
        workerData.value = updatedWorker

        // 2. Глобальная синхронизация через store для других компонентов
        store.commit('workers/updateWorker', updatedWorker)

        // 3. Персистентность - сохранение на сервере
        await store.dispatch('workers/update', {
          id: props.worker.id,
          data: updatedWorker,
        })

        // Уведомляем родительский компонент об успешном обновлении
        emit('workerUpdated', updatedWorker)

        // Сброс состояния формы
        isCommentShow.value = false
        commentText.value = ''
      } catch (e) {
        // Обработка ошибок с пользовательским уведомлением
        showToast.error(e.message)
      }
    }

    // ------------ ИЗМЕНЕНИЕ СТАТУСА ------------------

    const handleSelectChange = async (value) => {
      if (value === 'employed') {
        isNeedAddDateEmployment.value = true
      } else {
        updateStatus(value)
      }
    }

    const onDateChange = async () => {
      const date = new_employment_Date.value
      if (date) {
        await updateStatus('employed', date)
      }
    }

    const updateStatus = async (status, employmentDate = null) => {
      try {
        isLoadStatus.value = true

        const updatedWorker = {
          ...workerData.value,
          cur_status: status,
          ...(employmentDate !== null && { employment_Date: employmentDate }),
        }

        // Локально обновляем
        workerData.value = updatedWorker

        // Store и сервер
        store.commit('workers/updateWorker', updatedWorker)
        await store.dispatch('workers/update', {
          id: props.worker.id,
          data: updatedWorker,
        })

        emit('workerUpdated', updatedWorker)
        showToast.success('Статус успешно обновлён')
      } catch (e) {
        showToast.error('Не удалось обновить статус: ' + e.message)
        workerData.value = { ...props.worker }
      } finally {
        isLoadStatus.value = false
        isNeedAddDateEmployment.value = false
      }
    }

    // ПРОВЕРЯЕМ НА НАЛИЧИЕ ИЗМЕНЕНИЙ
    const hasChanges = computed(() => {
      if (!props.worker) return false

      return (
        fioEditable.value.trim() !== (props.worker.fio || '') ||
        phoneEditable.value !== formatPhoneForInput(props.worker.phone || '') ||
        int_dateEditable.value !== (props.worker.int_date || '') ||
        int_timeEditable.value !== (props.worker.int_time || '') ||
        positionEditable.value.trim() !== (props.worker.position || '') ||
        fioRucEditable.value.trim() !== (props.worker.fioRuc || '')
      )
    })

    const onPhoneInput = (e) => {
      const value = e.target.value
      // Если пользователь удалил всё — сбрасываем в пусто
      if (value === '' || value === '+7 (___) ___-__-__') {
        phoneEditable.value = ''
      }
    }

    // ОБНОВЛЯЕМ ДАННЫЕ ПО КНОПКЕ "ОБНОВИТЬ"
    const UpdateWorkerData = async () => {
      if (!workerData.value) return

      // 1. Валидация номера телефона
      try {
        await phoneSchema.validate(phoneEditable.value)
      } catch (validationError) {
        showToast.warning(validationError.message)
        return // ⬅️ прерываем выполнение, НЕ заходим в обновление
      }

      try {
        // 1.Создаем пакет обновляемых данных перед отправкой
        const updatedData = {
          ...workerData.value,
          fio: fioEditable.value.trim(),
          phone: normalizePhoneForServer(phoneEditable.value),
          int_date: int_dateEditable.value,
          int_time: int_timeEditable.value,
          position: positionEditable.value.trim(),
          fioRuc: fioRucEditable.value.trim(),
        }

        // 2. Обновляем локально
        workerData.value = { ...updatedData }

        // 3. Обновляем в store
        store.commit('workers/updateWorker', updatedData)

        // 4. обновляем на сервере
        store.dispatch('workers/update', {
          id: props.worker.id,
          data: updatedData,
        })

        // 5. Уведомляем HomePage
        emit('workerUpdated', updatedData)

        // 6. Успешное уведомление
        showToast.success('Данные успешно обновлены')

        // 7. Закрываем модалку
        emit('close')
      } catch (error) {
        // 7. Откат при ошибке: восстанавливаем из props.worker (оригинал)
        workerData.value = { ...props.worker }
        fioEditable.value = props.worker.fio || ''
        phoneEditable.value = props.worker.phone || ''
        int_dateEditable.value = props.worker.int_date || ''
        int_timeEditable.value = props.worker.int_time || ''
        positionEditable.value = props.worker.position || ''
        fioRucEditable.value = props.worker.fioRuc || ''

        showToast.error('Не удалось сохранить изменения: ' + error.message)
      }
    }

    const onClose = () => {
      emit('close')
    }

    const removeWithConfirm = () => {
      const confirmed = confirm('Вы уверены, что хотите удалить этого работника?')
      if (confirmed) {
        remove() // твой существующий async-метод
      }
    }

    const remove = async () => {
      try {
        await store.dispatch('workers/remove', props.worker.id)
        showToast.success('Кандидат удален', {
          position: 'bottom-right',
          duration: 3000,
        })
        emit('close')
      } catch (error) {
        showToast.error('Ошибка при удалении ', error)
      }
    }

    // Экспортируем реактивные данные и методы в template
    return {
      workerData,
      fioEditable,
      phoneEditable,
      int_dateEditable,
      int_timeEditable,
      positionEditable,
      fioRucEditable,
      isCommentShow,
      commentText,
      toggleShowComment,
      addComment,
      formatDate,
      formatDateTime,
      handleSelectChange,
      isLoadStatus,
      isNeedAddDateEmployment,
      new_employment_Date,
      onDateChange,
      UpdateWorkerData,
      hasChanges,
      onPhoneInput,
      onClose,
      removeWithConfirm,
      remove,
    }
  },
}
</script>

<style scoped>
.adaptive-modal {
  max-height: min(80vh, 800px); /* Не больше 80% экрана и 800px */
  min-height: 400px; /* Минимальная высота */
  overflow-y: auto;
  scrollbar-gutter: stable both-edges; /* Зарезервируем место под скроллбар */
  padding-right: 8px;
}
.scroll-always {
  overflow-y: scroll; /* Принудительное отображение скролла */
  overscroll-behavior: contain; /* Контроль эффекта перекатывания */
}

.ease-out-back {
  animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ---------- ADD_COMMENT_BLOCK ---------------- */

.addComment-enter-active,
.addComment-leave-active {
  transition: all 0.8s ease;
  max-height: 200px;
  opacity: 1;
}

.addComment-enter-from,
.addComment-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

/* ---------- ADD_COMMENT_LIST ---------------- */

.list-enter-from {
  opacity: 0;
  transform: scale(0.6);
}

.list-enter-active {
  transition: all 0.6s ease;
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.list-leave-active {
  transition: all 0.6s ease;
  position: absolute;
}
.list-move {
  transition: all 0.6s ease;
}

/* ---------------- ANIMATION_ADD_BTN ---------------- */

.addBtn-enter-from,
.addBtn-leave-to {
  opacity: 0;
}
.addBtn-enter-active,
.addBtn-leave-active {
  transition: all 0.6s ease;
}

/* ---------------- ANIMATION_FOOTER ------------------*/

.footer-enter-active,
.footer-leave-active {
  transition: all 0.6s ease;
  transform: translateY(0);
}

.footer-enter-from,
.footer-leave-to {
  transform: translateY(30%);
  opacity: 0;
}

/*-------------- INPUT_FOOTER ----------------------- */

.input-wrapper {
  width: 280px; /* или любая подходящая фиксированная ширина */
}

.input-width-enter-active,
.input-width-leave-active {
  transition:
    width 0.6s ease,
    opacity 0.6s ease;
  overflow: hidden;
}

.input-width-enter-from,
.input-width-leave-to {
  width: 0;
  opacity: 0;
}

/*-------------- КНОПКА ОБНОВИТЬ ----------------------- */

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.6s ease;
  transform: translateX(0);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(30%);
  opacity: 0;
}
</style>
