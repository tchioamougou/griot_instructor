<template>
  <CourseHeader :course="course" :save-enabled="true" :show-save-button="!excludedComponents.includes(selectedItem)"
    @save="handleSave()" @back="backToCourse" @settings="goToSetting" />
  <div class="lg:container mx-auto lg:px-16 py-0 ">
    <div class="flex flex-col md:flex-row min-h-screen">
      <!-- Sidebar Navigation -->
      <aside class="w-full md:w-64 border-r bg-white p-4">
        <div class="space-y-6">
          <div v-for="(menu, index) in tabs" :key="index">
            <h2 class="text-sm font-semibold uppercase text-gray-600 mb-2">{{ menu.label }}</h2>
            <div class="space-y-1">
              <button v-for="item in menu.items" :key="item.value" @click="handleItem(item.value)"
                :class="['w-full text-left px-2 py-1 rounded text-sm', selectedItem === item.value ? 'bg-purple-200 font-semibold' : 'hover:bg-purple-100']">

                <input type="checkbox" disabled :checked="(item.value == 'IntendedLearners' &&
                  course.intendedLearnersStep) ||
                  (item.value == 'CourseLandingPage' &&
                    course.courseLandingPageStep) ||
                  (item.value == 'CourseMessages' && course.courseMessagesStep) ||
                  (item.value == 'Pricing' && course.pricingStep) ||
                  ((item.value === 'Curriculum' ||
                    item.value === 'PracticeTest') &&
                    course.curriculumStep) ||
                  (item.value == 'FilmEdit' && course.courseFilmEditStep) ||
                  (item.value == 'CourseStructure' &&
                    course.courseStructureStep) ||
                  (item.value == 'SetupTestVideo' && course.courseSetupTestStep) ||
                  (item.value == 'Promotions')
                  " v-if="course.status === 'Draft'" />

                {{ item.label }}
              </button>
            </div>
          </div>
        </div>
        <div v-if="
          course.status &&
          course.status !== COURSE_STATUS.pending &&
          course.status !== COURSE_STATUS.published
        ">

          <Button class="mt-6 bg-purple-700 text-white w-full py-2 rounded" :disabled="canSubmit || isSaving"
            @click="submitForReview" :title="$t(course.status === 'Draft'
              ? 'submit_course'
              : 'course_submitted')
              ">{{ $t('submit_for_review') }}</Button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="lg:flex-1 p-6 bg-gray-50 overflow-y-auto w-full">
        <template v-if="course && course.id">
          <component :is="getSectionComponent" :course="course" ref="component" @refresh="refresh" />
        </template>
      </main>
    </div>
  </div>
  <SpinnerOverPage v-if="isLoading"></SpinnerOverPage>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onBeforeMount, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import router from '../../router';
import { useAuthStore } from '@/composables/user';
import { editMenusStore } from '@/composables/editItemService';
import { getCourseById, submitCourse } from '@/services/griot_service';
import {
  COURSE_STATUS,
  COURSE_TYPE,
  EDIT_COURSE_ITEMS
} from '@/utilities/utilityConstant';
import { useToast } from 'vue-toastification'
import { CircleCheckBig, MailIcon, ShieldCheck } from 'lucide-vue-next';
import CourseHeader from './CourseHeader.vue';
import { emitter } from "@/events/emitter.ts";

const toast = useToast();
// Async components
const CourseStudent = defineAsyncComponent(() => import('./CourseStudent.vue'));
const IntendedLearners = defineAsyncComponent(() => import('./IntendedLearners.vue'));
const CourseMessage = defineAsyncComponent(() => import('./CourseMessage.vue'));
const CourseStructure = defineAsyncComponent(() => import('./CourseStructure.vue'));
const CurriculumView = defineAsyncComponent(() => import('./Curriculum.vue'));
const CoursePricing = defineAsyncComponent(() => import('./CoursePricing.vue'));
const CoursePromotions = defineAsyncComponent(() => import('./CoursePromotions.vue'));
const CourseSetting = defineAsyncComponent(() => import('./CourseSetting.vue'));
const CourseAccessibility = defineAsyncComponent(() => import('./CourseAccessibility.vue'));
const CourseFilmAndEdit = defineAsyncComponent(() => import('./CourseFilmAndEdit.vue'));
const CourseSetupAndTest = defineAsyncComponent(() => import('./CourseSetupAndTest.vue'));
const CourseCaptions = defineAsyncComponent(() => import('./CourseCaptions.vue'));
const CourseLandingPage = defineAsyncComponent(() => import('./CourseLandingPage.vue'));
const SpinnerCmp = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'));
const SpinnerOverPage = defineAsyncComponent(() => import('@/components/spinner/SpinnerOverPage.vue'));
const PracticeTest = defineAsyncComponent(() => import('./practices/PracticeTest.vue'));
import Button from '@/components/ui/Button.vue';

const excludedComponents = [
  "CourseStructure",
  "SetupTestVideo",
  "FilmEdit",
  "Curriculum",
  "Captions",
  "Accessibility",
  "Pricing",
  "Promotions",
  "Settings",
  "PracticeTest",
];

// i18n
const { t } = useI18n();
const store = useAuthStore();
const editItemStore = editMenusStore();
// Refs
const selectedItem = ref('IntendedLearners');
const courseId = ref<string | null>(null);
const course = ref<Record<string, any>>({});
const items = ref<any[]>([]);
const itemsRef = ref<any[]>([]);
const isSaving = ref(false);
const isLoading = ref(false);

// Props
defineProps<{
  showValue?: boolean;
}>();

// Computed
const itemsList = computed(() => JSON.parse(editItemStore.menus));

const canSubmit = computed(() => {
  return !(
    course.value.intendedLearnersStep &&
    course.value.courseLandingPageStep &&
    course.value.courseMessagesStep &&
    course.value.pricingStep &&
    course.value.status === COURSE_STATUS.unpublished &&
    course.value.curriculumStep &&
    (
      (
        course.value.courseSetupTestStep &&
        course.value.courseFilmEditStep &&
        course.value.courseStructureStep &&
        course.value.type === COURSE_TYPE.course
      ) ||
      course.value.type === COURSE_TYPE.practiceTest
    )
  );
});

// Lifecycle
onBeforeMount(() => {
  //  store.dispatch('hideHeader');
  getParameters();
});

// Functions
const getParameters = () => {
  const navigationParams = router.currentRoute.value.params;
  if (navigationParams?.courseId && navigationParams?.item) {
    selectedItem.value = navigationParams.item as string;
    courseId.value = navigationParams.courseId as string;
    isLoading.value = true;
    console.log('Ienter here agains')
    getCourseLocal();
  }
};

const refresh = () => {
  if (!courseId.value || !selectedItem.value) return;
  getCourseById(courseId.value, selectedItem.value)
    .then(response => response.json())
    .then(data => {
      course.value = data;
    })
    .catch(error => {
      console.error('refresh', error);
    });
};

const getCourseLocal = () => {
  if (!courseId.value || !selectedItem.value) return;
  isLoading.value = true;
  getCourseById(courseId.value, selectedItem.value)
    .then(response => response.json())
    .then(data => {
      course.value = data;
      if (course.value.type === COURSE_TYPE.practiceTest) {
        items.value = course.value.status === COURSE_STATUS.unpublished
          ? EDIT_COURSE_ITEMS.practiceTest.draft
          : EDIT_COURSE_ITEMS.practiceTest.live;
      } else {
        items.value = course.value.status === COURSE_STATUS.unpublished
          ? EDIT_COURSE_ITEMS.draft
          : EDIT_COURSE_ITEMS.live;
      }
      editItemStore.setMenus(items.value);
      isLoading.value = false;
      init();
    })
    .catch(error => {
      toast.error(t('error_occur'));
      console.error('getCourseLocal', error);
    });
};

const showItem = (item: any) => {
  itemsRef.value.forEach((e) => {
    if (e.id === item.apiName) {
      e.classList.add('g-active-border-item');
    } else {
      e.classList.remove('g-active-border-item');
    }
  });
  selectedItem.value = item.apiName;
  console.log('selectedItem.value', selectedItem.value);
  router.push({
    name: 'editCourse',
    params: { courseId: courseId.value, item: selectedItem.value },
  });
  if (selectedItem.value == "Curriculum" && course.value.sections.length < 1) {
    refresh();
  }
};

const submitForReview = () => {
  if (!canSubmit.value && course.value.id) {
    isSaving.value = true;
    submitCourse(course.value.id)
      .then(response => response.json())
      .then(() => {
        toast.success(t('course_sumitted'));
        isSaving.value = false;
        refresh();
      })
      .catch(() => {
        toast.error(t('error_occur'));
        isSaving.value = false;
      });
  }
};

const goToSetting = () => {
  selectedItem.value = 'Settings';
  router.push({
    name: 'editCourse',
    params: { item: 'Settings', courseId: courseId.value },
  });
};

const init = () => {
  itemsRef.value.forEach((e) => {
    if (e.id === selectedItem.value) {
      e.classList.add('g-active-border-item');
    } else {
      e.classList.remove('g-active-border-item');
    }
  });
};

const backToCourse = () => {
  router.push('/course');
};


// Liste des onglets
const tabs = computed(() => {
  console.log('itemsList.value', itemsList.value);
  return itemsList.value?.map((item: any) => ({
    label: t(item.value),
    value: item.value,
    icon: item.icon || CircleCheckBig,
    items: item.items.map((el: any) => ({
      label: t(el.name),
      value: el.apiName,
      icon: el.icon || CircleCheckBig,
    })),
  }));
});
const handleItem = (key: string) => {
  showItem({ apiName: key });

}

const getSectionComponent = computed(() => {
  const components: Record<string, any> = {
    'IntendedLearners': IntendedLearners,
    'CourseStructure': CourseStructure,
    'SetupTestVideo': CourseSetupAndTest,
    'FilmEdit': CourseFilmAndEdit,
    'Curriculum': CurriculumView,
    'Captions': CourseCaptions,
    'Accessibility': CourseAccessibility,
    'CourseLandingPage': CourseLandingPage,
    'Pricing': CoursePricing,
    'Promotions': CoursePromotions,
    'CourseMessages': CourseMessage,
    'Settings': CourseSetting,
    'PracticeTest': PracticeTest,
  }
  return components[selectedItem.value] || IntendedLearners
})

const handleSave = () => {
  if (selectedItem.value === "IntendedLearners") {
    emitter.emit("save-intended-learners");
  } else if (selectedItem.value === "CourseMessages") {
    emitter.emit("save-course-messages");
  } else if (selectedItem.value === "CourseStructure") {
    emitter.emit("save-course-structure");
  } else if (selectedItem.value === "SetupTestVideo") {
    emitter.emit("save-course-setup-test");
  } else if (selectedItem.value === "FilmEdit") {
    emitter.emit("save-course-film-edit");
  } else if (selectedItem.value === "Curriculum") {
    emitter.emit("save-course-curriculum");
  } else if (selectedItem.value === "Captions") {
    emitter.emit("save-course-captions");
  } else if (selectedItem.value === "Accessibility") {
    emitter.emit("save-course-accessibility");
  } else if (selectedItem.value === "CourseLandingPage") {
    emitter.emit("save-course-landing-page");
  } else if (selectedItem.value === "Pricing") {
    emitter.emit("save-course-pricing");
  } else if (selectedItem.value === "Promotions") {
    emitter.emit("save-course-promotions");
  }
  else if (selectedItem.value === "Settings") {
    goToSetting();
  }
  else {
    console.warn('No handler for selected item:', selectedItem.value);
  }
}
</script>


<style scoped>
@media (max-width: 768px) {
  aside {
    order: 2;
  }

  main {
    order: 1;
  }
}

/* manage input check box*/

input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 2px solid #0a0809;
  border-radius: 0px;
  width: 16px;
  height: 16px;
  outline: none;
  position: relative;
  transition: border-color 0.3s ease-in-out;
  margin-right: 0.5em;
}

input[type="checkbox"]:checked:before {
  content: "\2713";
  width: 16px;
  height: 16px;
  background-color: black;
  position: absolute;
  color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-bottom: 0px;
  display: block;
  font-size: 16px;
  line-height: 16px;
  text-align: center;
}

input[type="checkbox"]:focus {
  border-color: black;
}

input[type="checkbox"]:checked:focus {}

input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 1;
}
</style>