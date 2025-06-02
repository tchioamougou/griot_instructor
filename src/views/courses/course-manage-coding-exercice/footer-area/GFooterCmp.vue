<template>
<footer class="d-flex justify-content-between fixed-bottom bg-light g-footer-shadow px-3 py-3">
  <div class=" ">
    <button
        type="button"
        class="g-button bg-white text-dark fw-bold g-border-1"
        title="Previous step"
    >
      {{ $t("previous_btn") }}
    </button>

  </div>
  <div class="d-flex flex-column justify-content-center">
    <g-tab-cmp :tabs="tabs" ref="tabsRefs" @selected-tab="handleSelectTab" />
  </div>
  <div class=" ">
    <button
        type="button"
        class="g-button fw-bold"
        title="Next"
    >
      {{ $t("continue_btn") }}
    </button>
  </div>
</footer>
</template>
<script setup>
const GTabCmp = defineAsyncComponent(()=>import('@/views/courses/course-manage-coding-exercice/content-area/GTabCmp.vue')) ;
const emits = defineEmits(['selectedTab'])
import {defineAsyncComponent, ref, watch} from "vue";
const tabs = [{value:'plan_exercise',label:'plan_exercise',done:true},{value:'author_solution',label:'author_solution'},{value:'guide_learners',label:'guide_learners'}]
const tabsRefs =ref(null);
const currentTab=ref(tabs[0]);
const handleSelectTab =(val)=>{
  currentTab.value =val;
  emits('selectedTab',currentTab.value.value);
}
watch(
    () => tabsRefs.value,
    (val) => {
      tabsRefs.value.setTab(currentTab.value.value);
      emits('selectedTab',currentTab.value.value);
    }
);
</script>
<style scoped>
.g-footer-shadow {
  border: 1px solid var(--griot-gray-200);
  -webkit-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  box-shadow: 0px -1px 3px rgba(50, 50, 50, 0.75);
}
.g-button.bg-white:hover{
  background-color: var(--griot-gray-200) !important;
}
.g-button:hover{
  opacity: 0.8;
}
.g-border-1{
  border-color: black;
}

</style>