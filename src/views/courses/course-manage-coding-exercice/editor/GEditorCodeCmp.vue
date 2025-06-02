<template>
  <div class="editor">
    <g-editor-tabs :tabs="items" />
    <v-ace-editor v-model:value="content" @init="editorInit" lang="java" theme="monokai"
      style="height: 80vh;width: 100%" :options="{
        useWorker: true, enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
      }" />
  </div>
</template>
<script setup>
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';
import './ace-config'
import { defineAsyncComponent, ref } from "vue";
const GEditorTabs = defineAsyncComponent(() => import("@/views/courses/course-manage-coding-exercice/editor/GEditorTabs.vue"))

const content = ref("");
const editorInit = () => {
}
const items = [
  { label: "index.js", name: "instructions" },
];
</script>


<style scoped></style>