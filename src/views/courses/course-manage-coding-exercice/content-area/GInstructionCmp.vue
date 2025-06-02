<template>
<div class="p-4">
  <p class="g-text-sm">{{$t('instructions_ob.description')}}</p>
  <g-rich-text-editor :data-placeholder="$t('instructions_ob.placeholder')" optional/>
</div>
</template>
<script setup>

import GRichTextEditor from "@/resources/GRichTextEditor.vue";
</script>
<style scoped>

</style>