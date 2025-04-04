<template>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="space-y-5 sm:space-y-6 h-screen">
        <!-- <ComponentCard title="All Booking"> -->
          <AllBooking/>
        <!-- </ComponentCard> -->
      </div>
    </AdminLayout>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
  import AdminLayout from "@/components/layout/AdminLayout.vue";
//   import ComponentCard from "@/components/common/ComponentCard.vue";
  import AllBooking from "@/components/tables/booking-tables/AllBookingTable.vue";
  const currentPageTitle = ref("Booking Lists");
  </script>
  