<template>
  <CourseHeader :course="course" :save-enabled="true"/>
  <div class="container-sm px-16">
    <EditMenu @tab-selected="changeTab" :tabs="tabs">
      <template #action>
        <div class="row justify-content-center mt-4" v-if="
          course.status &&
          course.status !== COURSE_STATUS.pending &&
          course.status !== COURSE_STATUS.published
        ">
          <div class="col-9">
            <button type="submit" class="g-button" @click="submitForReview" :disabled="canSubmit || isSaving" :title="$t(course.status === 'Draft'
              ? 'submit_course'
              : 'course_submitted')
              ">
              <spinner-cmp v-if="isSaving"></spinner-cmp>
              {{ $t('submit_for_review') }}
            </button>
          </div>

        </div>
      </template>
      <div class="container-md mt-4">
        <div class="row">
          <div class="col-3 gd-xl gd-md gd-lg">
            <div class="list-group mt-4" v-for="it in itemsList" :key="it.value">
              <span class="g-title">{{ $t(it.value ?? "") }}</span>
              <a href="#" class="list-group-item list-group-item-action" @click="showItem(el)" v-for="el in it.items"
                :key="el.apiName" ref="itemsRef" :id="el.apiName" :title="el.name"><input type="checkbox" disabled
                  :checked="(el.apiName == 'IntendedLearners' &&
                    course.intendedLearnersStep) ||
                    (el.apiName == 'CourseLandingPage' &&
                      course.courseLandingPageStep) ||
                    (el.apiName == 'CourseMessages' && course.courseMessagesStep) ||
                    (el.apiName == 'Pricing' && course.pricingStep) ||
                    ((el.apiName === 'Curriculum' ||
                      el.apiName === 'PracticeTest') &&
                      course.curriculumStep) ||
                    (el.apiName == 'FilmEdit' && course.courseFilmEditStep) ||
                    (el.apiName == 'CourseStructure' &&
                      course.courseStructureStep) ||
                    (el.apiName == 'SetupTestVideo' && course.courseSetupTestStep)
                    " v-if="course.status === 'Draft'" />{{ $t(el.name) }}</a>
            </div>

          </div>
          <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12">
            <template v-if="course && course.id">
              <intended-learners v-if="selectedItem === 'IntendedLearners'" :course="course" @refresh="refresh" />
              <course-landing-page v-if="selectedItem === 'CourseLandingPage'" :course="course" @refresh="refresh" />
              <course-message v-if="selectedItem === 'CourseMessages'" :course="course" @refresh="refresh" />
              <course-structure v-if="selectedItem === 'CourseStructure'" :course="course" />
              <curriculum-view v-if="selectedItem === 'Curriculum'" :course="course" @refresh="refresh" />

              <practice-test v-if="selectedItem === 'PracticeTest'" :course="course" @refresh="refresh" />
              <course-pricing v-if="selectedItem === 'Pricing'" :course="course" @refresh="refresh" />
              <course-promotions v-if="selectedItem === 'Promotions'" :course="course" @refresh="refresh" />
              <course-setting v-if="selectedItem === 'Settings'" :course="course" />
              <course-accessibility v-if="selectedItem === 'Accessibility'" />
              <course-captions v-if="selectedItem === 'Captions'" />
              <course-film-and-edit v-if="selectedItem === 'FilmEdit'" :course="course" @refresh="refresh" />
              <course-student v-if="selectedItem === 'Students'" :course-id="courseId" />
              <course-setup-and-test v-if="selectedItem === 'SetupTestVideo'" :course="course" @refresh="refresh" />
            </template>
          </div>
        </div>
      </div>
      <div class="text-center" v-if="isLoading">
        <spinner-cmp color="text-black" />
      </div>
    </EditMenu>
  </div>
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
import EditMenu from './EditMenu.vue';
import { CircleCheckBig, MailIcon, ShieldCheck } from 'lucide-vue-next';
import CourseHeader from './CourseHeader.vue';


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
const PracticeTest = defineAsyncComponent(() => import('./PracticeTest.vue'));

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

onBeforeUnmount(() => {
  //  store.dispatch('showHeader');
});

// Functions
const getParameters = () => {
  const navigationParams = router.currentRoute.value.params;
  if (navigationParams?.courseId && navigationParams?.item) {
    selectedItem.value = navigationParams.item as string;
    courseId.value = navigationParams.courseId as string;
    isLoading.value = true;
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
  router.push({
    name: 'editCourse',
    params: { courseId: courseId.value, item: selectedItem.value },
  });
  refresh();
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
  router.push('/instructor/courses');
};



const openTab = ref(1);
const selectedTab = ref('history')


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

// const changeTab = (tabIndex : any) => {
//   openTab.value = tabIndex;
//   selectedTab.value = tabs[tabIndex - 1].name

// };
const changeTab = (tabIndex: number) => {
  openTab.value = tabIndex;
  selectedTab.value = tabs.value[tabIndex - 1]?.name || 'general';
};

</script>



<style scoped></style>