<template>
  <div class="p-4">
    <p class="g-text-sm">{{ $t('hints_ob.description') }}</p>
    <g-rich-text-editor :data-placeholder="$t('hints_ob.placeholder')" optional />
  </div>
</template>
<script setup>
import { defineAsyncComponent } from "vue";
const GRichTextEditor = defineAsyncComponent(() => import('@/resources/GRichTextEditor.vue'))
</script>
<style scoped></style>