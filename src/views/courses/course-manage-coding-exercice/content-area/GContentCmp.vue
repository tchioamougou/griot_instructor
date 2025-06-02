<template>
  <div v-if="isLoading">
    <g-spinner/>
  </div>
  <div class="content" v-if="localItem &&!isLoading ">
    <g-header-cmp :url="backUrl"  :item="localItem"/>
    <div>
      <g-plan-exercise v-if="tab==='plan_exercise'" :item="localItem"/>
      <g-author-solution-cmp v-if="tab==='author_solution'"/>
      <g-guide-learner-cmp v-if="tab==='guide_learners'"/>
    </div>
    <g-footer-cmp @selected-tab="selectTab"/>
  </div>
</template>
<script setup>
import {defineAsyncComponent, ref} from "vue";
import router from "@/router";
import {getLecture} from "@/database/griot";
import GSpinner from "@/resources/GSpinner.vue"
const GHeaderCmp = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/header-area/GHeaderCmp.vue"));
const GFooterCmp = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/footer-area/GFooterCmp.vue"));
const GPlanExercise = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/content-area/GPlanExercise.vue"));
const GAuthorSolutionCmp = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/content-area/GAuthorSolutionCmp.vue"));
const GGuideLearnerCmp = defineAsyncComponent(() =>import("@/views/courses/course-manage-coding-exercice/content-area/GGuideLearnerCmp.vue"));;
const tab =ref(null);
const courseId = ref("");
const lectureId =ref(null);
const backUrl = ref("");
const localItem=ref(null);
const isLoading = ref(true);
const getParameters = () => {
  const navigationParams = router.currentRoute.value.params;
  const queries = router.currentRoute.value.query;
  courseId.value = navigationParams.courseId;
  lectureId.value = queries.lectureId;
  backUrl.value='/course/'+courseId.value+'/manage/Curriculum';
  loadData(true);
};
const selectTab = (val)=>{
  tab.value = val;
}
const loadData = (showSpinner) => {
  isLoading.value = showSpinner
  getLecture(lectureId.value).then((response) => {
    return response.json();
  }).then((data) => {
    localItem.value = data;
    isLoading.value = false;
  }).catch((error) => {
    console.log('This the error', error);
    isLoading.value = false;
  })
}
getParameters();
</script>


<style scoped>

</style>