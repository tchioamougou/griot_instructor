<template>
  <AdminLayout>
    <g-chat>
    <template v-slot:header>
      <h1 class="mb-0 fw-bold h2">{{ $t('Messages') }}</h1>
    </template>
  </g-chat>
  </AdminLayout>
  
</template>
<script setup lang="ts">
import GChat from '@/components/messages/GChat.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';

</script>


<style scoped></style>
