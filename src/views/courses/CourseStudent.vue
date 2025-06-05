<template>
  <ItemLayout :title="$t('Students')">
    <template #main>
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
          <!--  <g-student-carousel :elements="students" />-->
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
    </template>
  </ItemLayout>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue";
import { getStudents } from "@/services/griot_service";
import ItemLayout from "./items/ItemLayout.vue";

const SpinnerCmp = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'));
//const GStudentCarousel = defineAsyncComponent(() => import('../instructor/performance/GStudentCaroussel.vue'));

// Assuming you have a Vuex or Pinia store available
// Replace this with the correct store import and type
// import { useStore } from "@/store"; 
// const store = useStore();
const store: any = {}; // TEMP fallback, replace with actual store usage

const user = computed(() => store.state.user);

interface CourseOption {
  label: string;
  value: string;
}

interface Student {
  // Add actual properties from your student model
  id: string;
  name: string;
  [key: string]: any;
}

const props = defineProps<{
  courseId: string;
}>();

const courseOptions = ref<CourseOption[]>([{ label: "All course", value: "AllCourse" }]);
const students = ref<Student[]>([]);
const isLoading = ref<boolean>(false);
const totalStudent = ref<number>(0);
const init = ref<boolean>(true);

const getStudentsLocal = (): void => {
  isLoading.value = true;
  getStudents([props.courseId])
    .then((response) => response.json())
    .then((result: Student[]) => {
      totalStudent.value = result.length;
      students.value = result;
      isLoading.value = false;
    })
    .catch((error: unknown) => {
      isLoading.value = false;
      console.error("Error fetching students:", error);
    });
};

// Initialize data on component mount
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
