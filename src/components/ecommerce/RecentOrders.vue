<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
    <div class="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ $t('last_enrollement') }}</h3>
      </div>

      <div class="flex items-center gap-3">
        <button
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          {{ $t('see_all') }}
        </button>
      </div>
    </div>

    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <CustomTable :rows="products" :columns="columns"></CustomTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomTable from '@/components/tables/CustomTable.vue';
import { getEnrollmentsByInstructor } from "@/services/griot_service"
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const columns = [
  { key: 'title', label: t('course'), type: 'text' },
  { key: 'amountTotal', label: t('amount'), type: 'number' },
  { key: 'paymentStatus', label: t('status'), type: 'status' },
  { key: 'quantity', label: t('qaunity'), type: 'text' },
]

import { useAuthStore } from '@/composables/user'

const authStore = useAuthStore()

const user = computed(() => {
  const userData = authStore.user
  return JSON.parse(userData);
})
const products = ref([])

const geLocalEnrollment = () => {
  getEnrollmentsByInstructor(user.value.id).then((response: any) => {
    return response.json();
  }).then((result: any) => {
    products.value = result.map((e: any) => { return { ...e, paymentStatus: t(e.paymentStatus) } });
    console.log("result geLocalEnrollment", result);
  }).catch((error: any) => {
    console.log(error)
  })
}
geLocalEnrollment();
</script>
