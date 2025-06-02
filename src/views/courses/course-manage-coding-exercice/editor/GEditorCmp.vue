<script setup>
import {defineAsyncComponent} from "vue";
const GEditorHeader = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/editor/GEditorHeader.vue"));
const GEditorCodeCmp = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/editor/GEditorCodeCmp.vue"));

</script>

<template>
  <g-editor-header/>
  <g-editor-code-cmp/>
</template>

<style scoped>

</style>