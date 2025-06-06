<template>
  <admin-layout>
    <div class="container-md">
      <p class="h3 mt-3 mb-5 g-heading-serif-xxl" v-t="'revenue.title'" />

      <p class="h4 mt-3 mb-5 g-heading-serif-4xl">
        {{ getCurrencySymbolDefault() }} {{ totalEarn }}
      </p>

      <p>{{ $t('revenue.lifetimeEarnings', { date: formatDateT((new Date().toString())) }) }}</p>

      <!-- Statistic per month -->
      <div class="mt-4 g-border-1 shadow mb-5 p-4">
        <template v-if="isLoading">
          <spinner-cmp color="text-black" />
        </template>
        <template v-if="isError">
          <g-error-occur />
        </template>
        <template v-if="!isLoading && !isError && records && records.length > 0">
          <g-chart-live-data :gdata="records" />
        </template>
        <template v-else-if="!isLoading && !isError && (!records || records.length <= 0)">
          <div class="text-center mb-3" v-t="'revenue.noStatistic'" />
        </template>
      </div>

      <!-- Statistic data table -->
      <div>
        <template v-if="isLoading">
          <spinner-cmp color="text-black" />
        </template>
        <template v-if="isError">
          <g-error-occur />
        </template>
        <template v-if="!isLoading && !isError">
          <CustomTable :columns="columns" :rows="records" :perPage="5" />
        </template>
      </div>
    </div>
  </admin-layout>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue";
import { convertDateStringToMonthYearFormat, ROLE_INSTRUCTOR, STUDENT_ID } from "@/utilities/utilityConstant";
import { formatDateT, getCurrencySymbolDefault } from "@/utilities/UtilityFunction";
import { getUserMonthStat } from "@/services/griot_service";
import { useAuthStore } from '@/composables/user'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const authStore = useAuthStore()

const user = computed(() => {
  const userData = authStore.user
  return JSON.parse(userData);
})
const GChartLiveData = defineAsyncComponent(() => import('@/components/charts/GChartLiveData.vue'));
const CustomTable = defineAsyncComponent(() => import('@/components/tables/CustomTable.vue'));

const SpinnerCmp = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'));
const GErrorOccur = defineAsyncComponent(() => import('@/components/ui/GErrorOccur.vue'));

const isError = ref(false);
const isLoading = ref(false);
const columns = [
  { label: t('revenue.columns.timePeriod'), key: "month", type: "text" },
  { label: t('revenue.columns.preTax'), key: "totalValue", type: "text" },
  { label: t('revenue.columns.tax'), key: "withholdingTax", type: "text" },
  { label: t('revenue.columns.net'), key: "netEarnings", type: "text" },
  { label: t('revenue.columns.expectedDate'), key: "expectedPaymentDate", type: "text" },
  { label: t('revenue.columns.status'), key: "paymentstatus", type: "status" }
];


const records = ref([]);
const pageNumber = ref(1);
const pageSize = ref(10);
const totalPage = ref(1);
const totalRecords = ref(0);
const isInstructor = computed(() => {
  return user.value && user.value.role && user.value.role.id === ROLE_INSTRUCTOR;
});

const totalEarn = computed(() => {
    return user.value.totalEarns ?? 0;
});
const onChangeCurrentPage = (page:number) => {
  pageNumber.value = page;
  init(false);
}

const getUserMonthStatLocal = (value:any) => {
  isLoading.value = value;
  const service = getUserMonthStat(user.value.id, pageNumber.value, pageSize.value);
  service.then((response) => {
    console.log('result oooo', response);
    return response.json();
  }).then((result) => {
    records.value = result.records.map((e:any,y:any) => {
      return { ...e, month: convertDateStringToMonthYearFormat(e.month) }
    });
    totalPage.value = result.totalPage
    totalRecords.value = result.total;
    console.log('result oooo', result);
    isLoading.value = false;
  }).catch((error) => {
    isError.value = true;
    isLoading.value = false;
    console.log('error', error);
  })
}
// setup
const init = (value:any) => {
  getUserMonthStatLocal(value);
}
init(true);
</script>

<style scoped></style>
