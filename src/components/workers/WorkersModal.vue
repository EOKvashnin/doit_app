<template>
  <form @submit.prevent="onSubmit" class="overflow-y-auto p-3">
    <div class="flex gap-4">
      <!-- /* --------- ДАТА СОБЕСЕДОВАНИЯ ----------*/ -->
      <div class="form-control w-full" :class="{ invalid: idError }">
        <label class="label-modal" for="int_date">Дата собеседования</label>
        <input class="input-modal" type="date" id="int_date" v-model="int_date" @blur="idBlur" />
        <small class="text-pink-500" v-if="idError"> {{ idError }}</small>
      </div>

      <!-- /* --------- ВРЕМЯ СОБЕСЕДОВАНИЯ ----------*/ -->
      <div class="form-control w-full" :class="{ invalid: itError }">
        <label class="label-modal" for="int_time">Время собеседования</label>
        <input class="input-modal" type="time" id="int_time" v-model="int_time" @blur="itBlur" />
        <small class="text-pink-500" v-if="itError"> {{ itError }}</small>
      </div>
    </div>

    <div class="flex gap-4">
      <!-- /* --------- ФИО СОИСКАТЕЛЯ ----------*/ -->
      <div class="form-control w-full" :class="{ invalid: fioError }">
        <label class="label-modal" for="fio">ФИО кандидата</label>
        <input class="input-modal" type="text" id="fio" v-model="fio" @blur="fioBlur" />
        <small class="text-pink-500" v-if="fio"> {{ fioError }}</small>
      </div>

      <!-- /* --------- ТЕЛЕФОН СОИСКАТЕЛЯ ----------*/ -->
      <div class="form-control w-full" :class="{ invalid: phError }">
        <label class="label-modal" for="phone">Телефон кандидата</label>
        <input
          class="input-modal"
          type="text"
          id="phone"
          v-model="phone"
          @blur="phBlur"
          v-mask="'+7 (###) ###-##-##'"
          placeholder="+7 (___) ___-__-__"
        />
        <small class="text-pink-500" v-if="phError"> {{ phError }}</small>
      </div>
    </div>
    <div class="flex gap-4">
      <!-- /* --------- ФИО РУКОВОДИТЕЛЯ ----------*/ -->
      <div class="form-control w-full" :class="{ invalid: frError }">
        <label class="label-modal" for="fioRuc">ФИО Руководителя</label>
        <input class="input-modal" type="text" id="fioRuc" v-model="fioRuc" @blur="frBlur" />
        <small class="text-pink-500" v-if="fioRuc"> {{ frError }}</small>
      </div>

      <!---------------- ПЛОЩАДКА --------------------->
      <div class="form-control w-full">
        <label class="label-modal" for="source">Плошадка-источник</label>
        <select class="select-modal" id="source" v-model="source">
          <option value="hh">Head Hunter</option>
          <option value="avito">Авито</option>
          <option value="telephone">Телефон</option>
          <option value="job_center">Центр занятости</option>
          <option value="news_sputnik">Газета Спутник</option>
          <option value="news_prorab">Газета Прораб</option>
          <option value="vk">ВКонтакте</option>
          <option value="work_in_russia">Работа в России</option>
          <option value="friend">Привел друг</option>
          <option value="off_website">Сайт ЧЛМЗ</option>
        </select>
      </div>
    </div>

    <!-- /* --------- ДОЛЖНОСТЬ ----------*/ -->
    <div class="form-control" :class="{ invalid: posError }">
      <label class="label-modal" for="position">Должность</label>
      <input class="input-modal" type="text" id="position" v-model="position" @blur="posBlur" />
      <small class="text-pink-500" v-if="position"> {{ posError }}</small>
    </div>

    <div class="flex gap-4">
      <!-- /* ------------- СТАТУС -------------- */ -->
      <div class="form-control w-full">
        <label class="label-modal" for="cur_status">Статус</label>
        <select class="select-modal" id="cur_status" v-model="cur_status">
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

      <!-- /* --------- ДАТА ТРУДОУСТРОЙСТВА ----------*/ -->
      <div class="form-control w-full" :class="{ invalid: deError }">
        <label class="label-modal" for="employment_Date">Дата трудоустройства</label>
        <input
          class="input-modal"
          type="date"
          id="employment_Date"
          v-model="employment_Date"
          @blur="deBlur"
        />
        <small class="text-pink-500" v-if="deError"> {{ deError }}</small>
      </div>

      <!-- /* --------- ОСОБЫЕ ОТМЕТКИ ----------*/ -->
      <div class="form-control w-full">
        <label class="label-modal" for="special_notes">Особые отметки</label>
        <select class="select-modal" id="special_notes" v-model="special_notes">
          <option value="theBest">🔥🔥🔥</option>
          <option value="superGood">🔥🔥</option>
          <option value="good">🔥</option>
          <option value="bad">👎</option>
          <option value="none"></option>
        </select>
      </div>
    </div>

    <!-- /* --------- КОММЕНТАРИЙ ----------*/ -->
    <div class="form-control" :class="{ invalid: noteError }">
      <label class="label-modal" for="note">Комментарий</label>
      <textarea
        rows="3"
        class="area-modal"
        id="note"
        v-model="note"
        @blur="noteBlur"
        placeholder="Комментарий..."
      ></textarea>

      <small class="text-pink-500" v-if="position"> {{ noteError }}</small>
    </div>

    <button type="submit" class="btn-submit" :disabled="isSubmitting">Добавить</button>
  </form>
</template>

<script>
import { useWorkerForm } from '@/use/worker-form.js'
import { useStore } from 'vuex'
import { mask } from 'vue-the-mask'
import { useToast } from 'vue-toast-notification'

export default {
  directives: { mask },
  emits: ['created'],

  setup(_, { emit }) {
    const toast = useToast()
    const store = useStore()
    const submit = async (values) => {
      console.log(values)

      await store.dispatch('workers/create', values)
      emit('created')
    }

    return {
      ...useWorkerForm(submit),
    }
  },
}
</script>

<style scoped></style>
