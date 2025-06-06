<template>
  <admin-layout>
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h3>
      <profile-card />
      <personal-info-card />
      <address-card />
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '../../components/layout/AdminLayout.vue'
import { ref,computed } from 'vue'
import ProfileCard from '../../components/profile/ProfileCard.vue'
import PersonalInfoCard from '../../components/profile/PersonalInfoCard.vue'
import AddressCard from '../../components/profile/AddressCard.vue'
import { useAuthStore } from '@/composables/user'

const authStore = useAuthStore()

const user = computed (() => {
  const userData = authStore.user
  return JSON.parse(userData);
})
</script>
