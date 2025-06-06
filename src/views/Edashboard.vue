<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6" v-if="instructor">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics :instructor="instructor" />
        <monthly-target :instructor="instructor"/>
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-sale :instructor="instructor" />
      </div>

      <div class="col-span-12">
        <statistics-chart />
      </div>

      <div class="col-span-12 xl:col-span-5">
        <customer-demographic />
      </div>

      <div class="col-span-12 xl:col-span-7">
        <recent-orders />
      </div>
    </div>
  </admin-layout>
</template>

<script lang="ts" setup>
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '../components/ecommerce/MonthlySale.vue'
import MonthlySale from '../components/ecommerce/MonthlyTarget.vue'
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'
import { getUser } from '@/services/griot_service'
import { useAuthStore } from '@/composables/user'
import { computed,ref } from 'vue'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const instructor = ref(null);
const user = computed(() => {
  const userData = authStore.user
  return JSON.parse(userData);
})
const isLoading = ref(true);
const getInstructorDetails = () => {
  getUser(user.value.id)
    .then((response) => {
      console.log("getInstructorLocal=>response", response);
      return response.json();
    })
    .then((data) => {
      instructor.value = data;
      isLoading.value = false;
      console.log("getInstructorLocal=>result", data);
    })
    .catch((error) => {
      console.log("getInstructorLocal", error);
      isLoading.value = false;
    });
};
onMounted(() => {
  getInstructorDetails();
});
</script>
