
<template>
  <div>
    <editor-resizer>
      <template v-slot:left>
        <g-tabs-simple :tabs="items" ref="itemRefs" @selected="selectItem"/>
        <g-instruction-cmp v-if="currentItem==='instructions'"/>
        <g-related-lectures-cmp v-if="currentItem==='related_lectures'"/>
        <g-hints-cmp v-if="currentItem==='hints'"/>
        <g-solutions-explanation-cmp v-if="currentItem==='solution_explanation'"/>
      </template>
      <template v-slot:right><g-editor-cmp/></template>
    </editor-resizer>
  </div>
</template>
<script setup>
import GTabsSimple from "@/resources/GTabsSimple.vue";
import {defineAsyncComponent, ref, watch} from "vue";
const items = [
  { label: "guide_learners_ob.instructions", name: "instructions" },
  { label: "guide_learners_ob.related_lectures", name: "related_lectures" },
  { label: "guide_learners_ob.hints", name: "hints" },
  { label: "guide_learners_ob.solution_explanation", name: "solution_explanation" },
];
const EditorResizer = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/content-area/EditorResizer.vue"));
const GInstructionCmp = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/content-area/GInstructionCmp.vue"));
const GRelatedLecturesCmp = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/content-area/GRelatedLecturesCmp.vue"));
const GHintsCmp = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/content-area/GHintsCmp.vue"));
const GSolutionsExplanationCmp = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/content-area/GSolutionsExplanationCmp.vue"));
const GEditorCmp = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/editor/GEditorCmp.vue"));

const currentItem =ref(items[0].name);
const itemRefs =ref(null);
const selectItem = (item) => {
  if (currentItem.value !== item.name) {
    currentItem.value = item.name;
  }
};
watch(
    () => itemRefs.value,
    (val) => {
      itemRefs.value.gotoTab(currentItem.value);
    }
);

</script>

<style scoped>

</style>