<template>
    <admin-layout>
        <div class="p-6 bg-white rounded-xl shadow-sm w-full">
            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold">{{ $t('engagement.title') }}</h2>
                    <p class="text-sm text-gray-500">{{ $t('engagement.subtitle') }}</p>
                </div>
                <div class="flex gap-2">
                    <select v-model="selectedCourse" class="text-sm border px-2 py-1 rounded-md">
                        <option v-for="course in courseOptions" :key="course.value" :value="course.value">{{ course.label }}</option>
                    </select>
                    <select v-model="selectedRange" class="text-sm border px-2 py-1 rounded-md">
                        <option value="7d">Last 7 days</option>
                        <option value="30d">{{ $t('engagement.last30Days') }}</option>
                        <option value="12m">{{ $t('engagement.last12Months') }}</option>
                    </select>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 border-b pb-4 mb-6">
                <div>
                    <p class="text-sm text-gray-500">{{ $t('engagement.activeLearners') }}</p>
                    <h3 class="text-xl font-semibold">{{ activeLearners }}</h3>
                </div>
                <div>
                    <p class="text-sm text-gray-500">{{ $t('engagement.messagesSent') }}</p>
                    <h3 class="text-xl font-semibold">{{ messagesSent }}</h3>
                </div>
                <div>
                    <p class="text-sm text-gray-500">{{ $t('engagement.questionsAnswered') }}</p>
                    <h3 class="text-xl font-semibold">{{ questionsAnswered }}</h3>
                </div>
            </div>

            <!-- Chart -->
            <div style="height: 300px;">
                <apexchart width="100%" height="100%" type="bar" :options="chartOptions" :series="series" />
            </div>
        </div>
         <!-- Table -->
            <div class="mt-6">
                <h3 class="text-lg font-semibold mb-3">{{ $t('engagement.recentActivity') }}</h3>
                <CustomTable :columns="columns" :rows="activityRows" :perPage="5" />
            </div>
    </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import CustomTable from '@/components/tables/CustomTable.vue'
import { ref, computed } from 'vue'
import { format, subDays, subMonths } from 'date-fns'
import { getInstructorCourses } from '@/services/griot_service'
import { useAuthStore } from '@/composables/user'

const authStore = useAuthStore()

const user = computed(() => {
  const userData = authStore.user
  return JSON.parse(userData);
})
const selectedRange = ref('7d')
const selectedCourse = ref('AllCourse')
const courseOptions = ref([{ label: "All course", value: "AllCourse" }]);
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
// Engagement stats
const activeLearners = 127
const messagesSent = 56
const questionsAnswered = 33

// Table
const columns = [
    { key: 'course', label: 'Course', type: 'text' },
    { key: 'minutesTaught', label: 'Minutes Taught', type: 'text' },
    { key: 'Actives learners', label: 'Actives learners', type: 'text' },
    { key: 'minutesTaughtActuv', label: 'Minutes Taught per Actives learners', type: 'text' }
]

const activityRows :any = [
   ]

// Simulated engagement values (replace with API call in real app)
function generateRandomData(count: number) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 30 + 5))
}

// Generate labels for different date ranges
const chartLabels = computed(() => {
    if (selectedRange.value === '7d') {
        return Array.from({ length: 7 }, (_, i) =>
            format(subDays(new Date(), 6 - i), 'MMM d')
        )
    } else if (selectedRange.value === '30d') {
        return Array.from({ length: 30 }, (_, i) =>
            format(subDays(new Date(), 29 - i), 'MMM d')
        )
    } else if (selectedRange.value === '12m') {
        return Array.from({ length: 12 }, (_, i) =>
            format(subMonths(new Date(), 11 - i), "MMM ''yy")
        )
    } else {
        return []
    }
})

const chartData = computed(() => {
    return generateRandomData(chartLabels.value.length)
})

const chartOptions = computed(() => ({
    chart: { id: 'engagement-chart', toolbar: { show: false } },
    xaxis: {
        categories: chartLabels.value,
        labels: { style: { fontSize: '12px' } }
    },
    stroke: { curve: 'smooth' },
    colors: ['#4F46E5'],
    dataLabels: { enabled: false },
    grid: { borderColor: '#eee' }
}))

const series = computed(() => [
    {
        name: 'Engagements',
        data: chartData.value
    }
])

getInstructorCoursesLocal()
</script>
