<template>
  <AdminLayout>
    <div class="container-md mt-2">
      <div class="flex justify-between mb-3">
        <div class="">
          <span class="g-courses-title">{{ $t('Courses') }}</span>
        </div>
        <div>
          <div class="col-md-5 col-sm-5 mt-2 newBtn">
            <Button variant="primary" @click="newCourse">{{ $t('New course') }}</button>
          </div>
        </div>
      </div>
      <div class="flex gap-6 align-items-center mb-3">
        <div class="mt-2">
          <Input type="search" :placeholder="$t('instructor_search_placeholder')" icon="bi-search" v-model="searchText"
            @search="searchCourseByText" @keyup.enter="searchCourseByText" @change="searchCourseByText" />
        </div>
        <div class=" mt-2">
          <Select :options="sort_options" :is-required="false" v-model="selectedFilter"
            @update:model-value="getCourseLocal" />
        </div>

      </div>
      <div class="g-tip mb-10">
        <div class="title"><i class="bi bi-patch-exclamation-fill"></i> {{ $t('Tips') }}</div>
        <div class="list">
          <ul>
            <li>
              {{ $t('instructor_tips') }} <a href="#">{{ $t('Learn more') }}</a>
            </li>
          </ul>
        </div>
      </div>
      <!-- linear course -->
      <div v-if="isError">
        <g-error-occur />
      </div>
      <div class=" justify-content-center" v-if="courses && courses.length <= 10" style="margin: 0">
        <div class="border rounded-md mb-5" v-for="course in courses" :key="course.id">
          <div class="flex justify-between pe-16" @click="goto(course)">
            <!-- course image and title -->

            <div class="line">
              <div class="image_title">
                <div class="col-4 image">
                  <span><img v-if="course.picture" :src="course.picture" class="g-image" alt="Course Image" />
                    <img v-if="!course.picture" src="@/assets/images/placeholder.png" class="g-image"
                      alt="Course Image" /></span>
                </div>
                <div class="pb-2 pt-2 title">
                  <span class="card-title">
                    <div class="title">{{ course.title }}</div>
                    <div class="price">
                      <span class="status ps-2 pe-2 rounded-lg text-sm" style="color: white">
                        {{ $t(course.status) }}
                      </span>
                      <span class="ms-2 text-base" v-if="course.status === 'Published'">
                        {{ course.price?.currency?.symbol }}
                        {{ course.originalPrice }}</span>
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <template v-if="course.status === 'Published'">
              <div class="col-3 pb-2 pt-2 gd-md">
                <span class="text-sm"><strong>{{ getCurrencySymbolDefault() }} {{ course.earnsThisMonth
                }}</strong></span>
                <br />
                <span class="text-sm">{{ $t('Earned this month') }}</span>
                <br />
                <span class="text-sm"><strong>{{ getCurrencySymbolDefault() }} {{ course.totalEarns }}</strong></span>
                <br />
                <span class="text-sm">{{ $t('Total Earned') }}</span>
              </div>
              <div class="col-3 pb-2 pt-2 gd-md">
                <span class="text-sm"><strong>{{ course.enrolledThisMonth }}</strong></span>
                <br />
                <span class="text-sm">{{ $t('Enrollments this month') }}</span>
                <br />
                <span class="text-sm"><strong>{{ course.totalStudents }}</strong></span>
                <br />
                <span class="text-sm">{{ $t('Total Enrollments') }}</span>
              </div>

            </template>

          </div>
        </div>
      </div>

      <div class="row mt-16 pt-16">
        <div class="col-12">
          <p class="h2 text-center mb-5">
            {{ $t('have_questions') }}
          </p>
          <div class="flex justify-between gap-15">
            <div class="col-sm-12 col-md-2 text-center question" v-for="(de, ind) in descriptionsAction" :key="ind">
              <span><i :class="'bi fs-1 ' + de.icon" :title="de.linkText"></i></span>
              <br />
              <a href="#" :title="de.linkText">{{ $t(de.linkText) }}</a>
              <br />
              <span class="mt-1">{{ $t(de.description) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="showAddCourse">
      <AddCourse @close="close" @created="created"></AddCourse>
    </template>
  </AdminLayout>

</template>
<script setup lang="ts">
import { getCourseByInstructorId } from '@/services/griot_service.ts';
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from '@/composables/user'
import { DESCRIPTION, SORT_OPTIONS } from "@/utilities/utilityConstant.ts";
import GErrorOccur from "@/components/ui/GErrorOccur.vue";
import { getCurrencyDefault, getCurrencySymbolDefault } from "@/utilities/UtilityFunction";
import Select from '@/components/forms/FormElements/Select.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Button from '@/components/ui/Button.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue';
import AddCourse from "@/views/courses/AddCourse.vue"
import router from "@/router"
import { useToast } from 'vue-toastification'

const toast = useToast();

// Type definitions
interface Course {
  id: number;
  [key: string]: any;
}

interface CourseResponse {
  courses: Course[];
}

// State and constants
const isError = ref<boolean>(true);
const sort_options = SORT_OPTIONS;
const selectedFilter = ref<string>(SORT_OPTIONS[0].value);
const pageNumber = ref<number>(1);
const pageSize = ref<number>(10);
const courses = ref<Course[]>([]);
const loading = ref<boolean>(true);
const showAddCourse = ref<boolean>(false)

const styleConfig = {
  fullStarColor: "#ed8a19",
  emptyStarColor: "#737373",
  starWidth: 10,
  starHeight: 10,
};

const descriptionsAction = DESCRIPTION;
const searchText = ref<string>("");

const user = computed(() => JSON.parse(useAuthStore().getUser));
console.log('useAuthStore()', useAuthStore().getUser);
// Methods
const getCourseLocal = async () => {
  loading.value = true;
  isError.value = false;

  await getCourseByInstructorId(
    user.value.id,
    searchText.value,
    pageNumber.value,
    pageSize.value,
    selectedFilter.value
  )
    .then((response: Response) => {
      console.log("getCourseLocal", response);
      if (response.status !== 200) {
        isError.value = true;
      }
      return response.json();
    })
    .then((result: CourseResponse) => {
      console.log("getCourseLocal", result);
      courses.value = result.courses;
      loading.value = false;
    })
    .catch((error) => {
      console.error("getCourseLocal", error);
      isError.value = true;
      loading.value = false;
    })

};

const newCourse = () => {
  showAddCourse.value = true;
};

const close = () => {
  showAddCourse.value = false;
};

const created = (courseId : any) => {
  console.log('created', courseId);
  close();
  toast.success('Created');
  getCourseLocal();

}

const goto = (course: Course) => {
  router.push(`/course/${course.id}/manage/IntendedLearners`);
};

const searchCourseByText = () => {
  getCourseLocal();
};

// Lifecycle
onMounted(() => {
  getCourseLocal();
});
</script>

<style scoped>
.g-courses-title {
  font-size: 40px;
  font-weight: bolder;
}

.card-title {
  font-weight: bolder;
}

.g-image {
  width: 100%;
  height: 100%;
}

.line {
  padding: 0 !important;
}

.finishCourse {
  padding-top: 3.5%;
}

.progress {
  height: 0.5em;
  margin-top: 0.1em;
}

.card-title {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.status {
  background-color: var(--g-c-blue-dark);
}

.card-title .title {
  display: block !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  margin-top: 0.3rem;
  margin-bottom: 1em;
  font-size: small;
}


.progress {
  border-radius: 0;
}

.image_title {
  display: flex;
  flex-direction: row;
}

.image_title .image {
  height: 120px;
  width: 120px;
  margin-right: 0.4em;
}

.image_title .title {
  display: flex;
  flex-direction: column;
}

.price {
  margin-top: auto;
}

.newBtn {
  display: flex;
  justify-content: right;
  flex-direction: row;
  height: 3em;
}

.question a {
  padding-top: 2em;
  font-weight: bold;
  text-decoration: none;
  color: var(--g-c-blue-dark);
}

.question a:hover {
  color: darkviolet;
}
</style>
