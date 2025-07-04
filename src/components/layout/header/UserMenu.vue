<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img :src="user.picture" alt="User" class="h-full w-full" />
      </span>

      <span class="block mr-1 font-medium text-theme-sm"> {{ fullName }} </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ fullName }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ Email }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <!-- SVG icon would go here -->
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <router-link
        to="/signin"
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
       {{$t('SignOut')}}
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted ,computed} from 'vue'
import { useAuthStore } from '@/composables/user'
import { useRouter } from 'vue-router'
import { useI18n } from "vue-i18n";
const dropdownOpen = ref(false)
const dropdownRef = ref<any>(null)
const { t } = useI18n();
const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: t('Viewprofile') },
  { href: '/setting', icon: SettingsIcon, text: t('Accountsettings') },
  // { href: '/profile', icon: InfoCircleIcon, text: 'Support' },
]




const authStore = useAuthStore()
const router = useRouter()

const fullName = computed(() => {
  const userData = authStore.user
  const user = JSON.parse(userData);
  return `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
});
const user = computed(() => {
  const userData = authStore.user
  return JSON.parse(userData);
})
const Email = computed(() => {
  return `${user.value?.email ?? ''}`
})

const signOut = () => {
  authStore.logout()
  closeDropdown()
  router.push('/signin')
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

// const signOut = () => {
//   // Implement sign out logic here
//   console.log('Signing out...')
//   closeDropdown()
// }

const handleClickOutside = (event:any) => {
  if (dropdownRef.value && !dropdownRef.value?.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
