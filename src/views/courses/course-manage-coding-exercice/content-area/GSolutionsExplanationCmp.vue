<template>
  <div class="p-4">
    <p class="g-text-sm ">{{$t('solution_explanation_ob.description')}}</p>
    <div class="mb-3">
      <a href="#" class="fw-bold g-text-sm"><i class="bi bi-clipboard"></i>{{$t('paste_solution_code')}}</a>
    </div>
    <g-rich-text-editor :data-placeholder="$t('solution_explanation_ob.placeholder')" optional/>
  </div>
</template>
<script setup>

import GRichTextEditor from "@/resources/GRichTextEditor.vue";
</script>
<style scoped>
@import url(../../../../assets/css/link.css);
</style>