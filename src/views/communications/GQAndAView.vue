<template>
  <AdminLayout>
    <g-chat>
      <template v-slot:header>
        <div class="flex justify-between">
          <h1 class="font-bold">{{ $t('Questions') }}</h1>
        </div>
      </template>
    </g-chat>
  </AdminLayout>

</template>
<script setup lang="ts">
import GChat from '@/components/messages/GChatQuestion.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';


</script>


<style scoped></style>
