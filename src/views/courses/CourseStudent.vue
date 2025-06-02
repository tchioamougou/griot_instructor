<template>
  <div class="g-students">
    <div class="header">
      <div class="header_title">
        <div class="title">{{ $t('Students') }}</div>
      </div>
    </div>
    <template v-if="isLoading">
      <div class="spinner_div">
        <spinner-cmp color="text-black" />
      </div>
    </template>
    <template v-else>
      <div class="number_student">
        <span class="number">{{ totalStudent }}</span><span>{{ $t('Students') }}</span>
      </div>
      <div class="students_list">
        <div class="title">{{ $t('pleople_taking_your_course') }}</div>
        <div class="list">
          <g-student-carousel :elements="students" />
        </div>
      </div>
    </template>
    <div class="your_reach">
      <div class="your_reach-header">
        <span><span class="title">{{ $t('you_reach') }}</span><span class="subTitle">{{ $t('see_student') }}</span>
        </span>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, defineAsyncComponent, ref } from "vue";
import { getStudents } from "../../database/griot";
const SpinnerCmp = defineAsyncComponent(() => import('../../resources/Spinner.vue'));
const GStudentCarousel = defineAsyncComponent(() => import('../instructor/performance/GStudentCaroussel.vue'));

const user = computed(() => {
  return store.state.user;
});
const props = defineProps({
  courseId: {
    type: String,
    required: true,
  }
})
const courseOptions = ref([{ label: "All course", value: "AllCourse" }]);
const students = ref([]);
const isLoading = ref(false);
const totalStudent = ref(0);
const init = ref(true);
const getStudentsLocal = () => {
  isLoading.value = true;
  getStudents([props.courseId]).then((response) => {
    return response.json();
  }).then((result) => {
    totalStudent.value = result.length;
    students.value = result;
    isLoading.value = false;
    //console.log('result is comming',students);

  }).catch((error) => {
    isLoading.value = false;
    console.log('error is comming', error);
  })
};


/***start/
 *
 */
getStudentsLocal();
</script>
<style scoped>
#chartdiv {
  width: 100%;
  height: 600px;
}

.g-students {
  font-family: sans-serif;
}

.students_list .title {
  margin: 0.5em 0;
  font-size: 0.95em;
}

.students_list {
  margin: 2em 0;
}

.header {}

.header_title {
  display: flex;
  flex-direction: row;
}

.header_title .title {
  font-weight: 900;
  font-family: sans-serif;
  font-size: 1.7em;
  margin-right: 1em;
}

.list {
  width: 97%;
}

.number_student {
  text-transform: capitalize;
  margin-top: 1.5em;
  font-size: 0.9em;
}

.number_student .number {
  font-weight: 700;
  font-size: 1.3em;
}

.your_reach {
  margin-top: 4em;
}

.your_reach-header .title {
  font-weight: 900;
}

.your_reach-header .subTitle {
  font-size: 0.9em;
  margin-left: 2em;
}

.spinner_div {
  text-align: center;
  margin-top: 5em;
}
</style>
