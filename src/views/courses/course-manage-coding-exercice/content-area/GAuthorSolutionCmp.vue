
<template>
<div>
  <editor-resizer>
    <template v-slot:left>
      <g-editor-cmp/>
    </template>
    <template v-slot:right>
      <g-editor-cmp />
    </template>
  </editor-resizer>
</div>
</template>
<script setup>
import {defineAsyncComponent} from "vue";
const EditorResizer = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/content-area/EditorResizer.vue"));
const GEditorCmp = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/editor/GEditorCmp.vue"));

</script>

<style scoped>

</style>