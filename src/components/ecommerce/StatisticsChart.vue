<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
    <div class="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
      <div class="w-full">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ $t('Statistics') }}</h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          {{ $t('your_month') }}
        </p>
      </div>

      <div class="relative">
        <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
          <button  v-for="option in options" :key="option.value" @click="selectOption(option.value)" :class="[
            selected === option.value
              ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
              : 'text-gray-500 dark:text-gray-400',
            'px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 hover:shadow-theme-xs dark:hover:bg-gray-800 dark:hover:text-white',
          ]">
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartThree" class="-ml-4 min-w-[1000px] xl:min-w-full pl-2">
        <VueApexCharts type="area" height="310" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getInstructorStatPeriod } from '@/services/griot_service';
import { useAuthStore } from '@/composables/user'
import { formatMonthYear } from "@/utilities/UtilityFunction"
import VueApexCharts from 'vue3-apexcharts'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const options = [
  { value: 'monthly', label: 'Monthly' },
  { value: '30days', label: t('30days') },
  { value: 'week', label: t('week') },
]
const authStore = useAuthStore()
const user = computed(() => {
  const userData = authStore.user
  return JSON.parse(userData);
})
const selected = ref('monthly')
// Example usage in a setup function or method
const stats = ref<any>([])
const selectOption =(val:string)=>{
selected.value = val;
fetchRevenue(user.value.id, val)
}
const fetchRevenue = async (instructorId: string,val:string="monthly") => {
  try {
    const response = await getInstructorStatPeriod(instructorId,val);
    const data = await response.json();
    stats.value = data;
    console.log("Revenue data:", data);
    // Do something with data
  } catch (error) {
    console.error("Failed to fetch revenue:", error);
  }
};
const series = computed(() => {
  return [
    {
      name: t('Sales'),
      data: stats.value.map((e: any) => e.revenue),
    },
    {
      name: t('totalStudents'),
      data: stats.value.map((e: any) => e.totalStudents),
    },
  ]
})

const chartOptions = computed(() => {
  return {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#465FFF', '#9CB9FF'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        enabled: true,
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    stroke: {
      curve: 'straight',
      width: [2, 2],
    },
    markers: {
      size: 0,
    },
    labels: {
      show: false,
      position: 'top',
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
    },
    xaxis: {
      type: 'category',
      categories: stats.value.map((e: any) => formatMonthYear(e.label)),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
    },
  }
})
fetchRevenue(user.value.id)
</script>

<style scoped>
.area-chart {
  width: 100%;
}
</style>
