<template>
  <div class="p-4">
    <p class="g-text-sm">{{$t('related_lectures_ob.description')}}</p>
    <div class="d-flex justify-content-end">
    <span class="g-text-sm">{{$t('optional')}}</span>
    </div>
    <g-select />
  </div>
</template>
<script setup>
import GSelect from "@/resources/GSelect.vue";
</script>
<style scoped>

</style>