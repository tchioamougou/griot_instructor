<template>
  <admin-layout>
    <div v-if="!editProf"
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">{{ $t('Profile') }}</h3>
      <profile-card @edit="handleEdit"/>
      <personal-info-card  @edit="handleEdit"/>
     <!-- <address-card />-->

    </div>
     <div v-else
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-4"
    >
      <EditProfile @close="editProf=false"></EditProfile>

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
import EditProfile from '@/components/profile/EditProfile.vue'

const authStore = useAuthStore()
const editProf = ref(false)
const user = computed (() => {
  const userData = authStore.user
  return JSON.parse(userData);
})
const handleEdit =()=>{
  editProf.value = true;
}
</script>
