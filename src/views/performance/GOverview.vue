<template>
  <admin-layout>
    <div class="p-6 bg-white rounded-xl shadow-sm w-full">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold">{{ $t('overview.title') }}</h2>
          <p class="text-sm text-gray-500">{{ $t('overview.subtitle') }}</p>
        </div>
        <select v-model="selectedCourse" class="text-sm border px-2 py-1 rounded-md">
          <option v-for="course in courseOptions" :key="course.value" :value="course.value">{{ course.label }}</option>
        </select>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 border-b pb-4 mb-4">
        <div>
          <p class="text-sm text-gray-500">{{ $t('overview.totalRevenue') }}</p>
          <h3 class="text-xl font-semibold">${{ totalRevenue }}</h3>
          <p class="text-xs text-gray-400">${{ revenueThisMonth }} {{ $t('overview.thisMonth') }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ $t('overview.totalEnrollments') }}</p>
          <h3 class="text-xl font-semibold">{{ totalEnrollments }}</h3>
          <p class="text-xs text-gray-400">{{ enrollmentsThisMonth }} {{ $t('overview.thisMonth') }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ $t('overview.instructorRating') }}</p>
          <h3 class="text-xl font-semibold">{{ instructorRating }}</h3>
          <p class="text-xs text-gray-400">{{ ratingsThisMonth }} {{ $t('overview.ratingsThisMonth') }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex justify-between items-center mb-4">
        <label class="text-sm text-gray-600">{{ $t('overview.dateRange') }}:</label>
        <div class="flex gap-2">
          <select v-model="selectedRange" class="text-sm border px-2 py-1 rounded-md">
            <option value="12m">{{ $t('overview.last12Months') }}</option>
            <option value="6m">{{ $t('overview.last6Months') }}</option>
          </select>
          <button class="bg-purple-600 text-white px-3 py-1 rounded-md text-sm">
            {{ $t('overview.export') }}
          </button>
        </div>
      </div>

      <div style="height: 300px;">
        <!-- Apex Chart -->
      <apexchart width="100%" height="100%" type="line" :options="chartOptions" :series="series" />
      </div>

      <!-- Revenue report link -->
      <div class="text-sm text-purple-600 text-right mt-4 cursor-pointer hover:underline">
        {{ $t('overview.revenueReportLink') }} &rsaquo;
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { isLoading } from '@/composables/spinner'
import { getInstructorCourses } from '@/services/griot_service'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/composables/user'

const authStore = useAuthStore()

const user = computed(() => {
  const userData = authStore.user
  return JSON.parse(userData);
})
const selectedCourse = ref('AllCourse')
const courseOptions = ref([{ label: "All course", value: "AllCourse" }]);
const selectedRange = ref('12m')
const getInstructorCoursesLocal = () => {
  getInstructorCourses(user.value.id)
    .then((response) => {
        console.log("response is", response);
      return response.json();
    })
    .then((result) => {
        console.log("response is", result);
      courseOptions.value = courseOptions.value.concat(
        result.map((e: any) => {
          return { label: e.title, value: e.id };
        })
      );
    })
    .catch((error) => {
    });
};
// Stats
const totalRevenue = 1556.02
const revenueThisMonth = 3.53
const totalEnrollments = 694
const enrollmentsThisMonth = 2
const instructorRating = 3.45
const ratingsThisMonth = 0

// Chart Data
const labels12 = [
  'Jul ’24', 'Aug ’24', 'Sep ’24', 'Oct ’24', 'Nov ’24', 'Dec ’24',
  'Jan ’25', 'Feb ’25', 'Mar ’25', 'Apr ’25', 'May ’25', 'Jun ’25'
]
const labels6 = labels12.slice(-6)

const fullData = [32, 28, 24, 19, 23, 10, 29, 17, 13, 8, 30, 9]
const shortData = fullData.slice(-6)

const chartLabels = computed(() => selectedRange.value === '12m' ? labels12 : labels6)
const chartSeriesData = computed(() => selectedRange.value === '12m' ? fullData : shortData)

const chartOptions = computed(() => ({
  chart: {
    id: 'revenue-chart',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  xaxis: {
    categories: chartLabels.value,
    labels: { style: { fontSize: '12px' } }
  },
  stroke: {
    curve: 'smooth'
  },
  colors: ['#8A4DFF'],
  dataLabels: {
    enabled: false
  },
  grid: {
    borderColor: '#eee'
  }
}))

const series = computed(() => [
  {
    name: 'Revenue',
    data: chartSeriesData.value
  }
])

getInstructorCoursesLocal()
</script>


<style scoped></style>
