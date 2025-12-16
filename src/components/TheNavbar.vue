<template>
  <nav
    class="relative bg-gray-400/10 shadow-sm dark:bg-gray-800/20 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
  >
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center justify-center gap-2 cursor-pointer">
            <Icon icon="streamline-ultimate:space-rocket-earth" class="text-indigo-500 w-6 h-6" />
            <h1 class="text-2xl text-indigo-600 font-bold">Do <mark>it</mark></h1>
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <router-link to="/" class="nav-title" active-class="nav-title-active" exact>
                Главная
              </router-link>
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <div class="text-gray-600 hover:text-indigo-500 cursor-pointer" @click.prevent="logout">
            <Icon icon="lucide:log-out" class="w-7 h-7" />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  components: {
    Icon,
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    const logout = () => {
      store.commit('auth/logout')
      router.push('/auth')
    }

    return {
      logout,
    }
  },
}
</script>
