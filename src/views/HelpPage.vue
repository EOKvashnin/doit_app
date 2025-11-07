<template>
  <div class="w-[80%] max-w-full mx-auto flex justify-center flex-wrap gap-4 items-stretch py-5">
    <!-- Карточка 1: POWER STAFF -->
    <div
      class="max-w-[80%] p-6 flex bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="content mr-8">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Power staff
        </h2>
        <p class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Приложение объединяет три ключевые возможности для HR:
        </p>
        <ul class="max-w-xl space-y-3 text-gray-500 list-inside dark:text-gray-400">
          <li class="flex items-center gap-3">
            <svg
              class="mt-0.5 w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
              />
            </svg>
            Полный реестр кандидатов с гибкой фильтрацией по полям
          </li>
          <li class="flex items-center gap-3">
            <svg
              class="mt-0.5 w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
              />
            </svg>
            Аналитическая панель для просмотра статистики по трудоустройству и увольнениям
          </li>
          <li class="flex items-center gap-3">
            <svg
              class="mt-0.5 w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
              />
            </svg>
            Комментарии по каждому кандидату — чтобы сохранять всю историю взаимодействий в одном
            месте
          </li>
          <li class="flex items-center gap-3">
            <svg
              class="mt-0.5 w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
              />
            </svg>
            Интерфейс минималистичный, но функциональный: всё необходимое — под рукой, без лишних
            кликов
          </li>
        </ul>
      </div>

      <!-- Карточка 2: РАЗРАБОТЧИК-->

      <div
        class="min-w-[280px] max-w-sm bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
      >
        <div class="flex flex-col items-center pb-10 px-4">
          <img
            class="w-40 h-40 mb-3 rounded-full shadow-lg"
            src="@/assets/avatar.png"
            alt="Фотография Евгения Квашнина"
          />
          <h3 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Квашнин Евгений</h3>
          <span class="text-sm text-gray-500 dark:text-gray-400">Frontend-разработчик</span>
          <span class="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
            По всем вопросам, связанным с работой приложения, писать на почту
          </span>

          <div class="mt-4">
            <a
              href="mailto:eo_kvashnin@bk.ru"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-400 rounded-lg hover:bg-pink-500 hover:text-white dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-pink-600 transition-colors duration-250"
            >
              Написать
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
