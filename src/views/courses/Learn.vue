<template>
  <template v-if="playTest">
    <g-question-play :pt="currentPracticeTest" @finished="testFinished" />
  </template>
  <template v-else>
    <template v-if="loading"><g-spinner></g-spinner></template>
    <template v-else>
      <nav class="navbar navbar-dark bg-dark fixed-top">
        <span class="navbar-brand ps-4 pe-4 pt-3 pb-3">
          <span class="me-2 g-header-text-title">
            <img src="../../assets/images/logo/Griot-black-review.ico" title="Griot logo" alt="griot logo"
              class="g-logo" />
          </span>
          <span class="vr"></span>
          <span class="ms-2 g-heading-serif-lg">{{
            originalCourse?.title
          }}</span></span>
        <span class="navbar-brand"><span class="me-4 g-heading-details g-pointer" @click="leaveRating"><i
              class="bi bi-star me-2" style="color: yellow"></i>
            <span v-if="!course.review">{{ $t('leave_review') }}</span>
            <span v-else>{{ $t('edit_review') }}</span>
          </span>
          <span class="me-4 g-heading-details">{{ $t('progresssion') }}: {{ course.percentage }} %</span>
        </span>
      </nav>
      <template v-if="currentLecture || currentPracticeTest">
        <div class="container-fluid">
          <div class="row justify-content-center mt-5 mb-5">
            <div :class="!closed ? 'col-md-9 col-sm-12 col-lg-9 col-xl-9' : 'col-12'
              ">
              <template v-if="currentLecture">
                <!--Preview video presentation-->
                <play-course :lecture="currentLecture" @next="nextLecture" @previous="previousLecture" @share="share"
                  v-if="currentLecture.lecture.type == 'Lecture'" ref="player" />
                <div v-if="currentLecture.lecture.type == 'Quiz'" class="mt-5">
                  <g-quiz :lecture-progression="currentLecture" @next="nextLecture"></g-quiz>
                </div>
              </template>
              <practice-test-tile :pt="currentPracticeTest" :course-id="originalCourse.id" v-if="currentPracticeTest"
                :learning-course-id="course.id" @fullscreen="onFullscreen" @expand="onExpand" @next="onNext"
                @retake="onRetake" @begin="onBegin" ref="question_player" />
              <!-- tab Management-->
              <div class="g-course-tabs" v-if="originalCourse">
                <nav>
                  <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <button class="nav-link gd-sm gd-sm" id="nav-course-tab" data-bs-toggle="tab"
                      data-bs-target="#nav-course" type="button" role="tab" aria-controls="nav-course"
                      aria-selected="true">
                      {{ $t('course_content') }}
                    </button>
                    <button class="nav-link active" id="nav-overview-tab" data-bs-toggle="tab"
                      data-bs-target="#nav-overview" type="button" role="tab" aria-controls="nav-overview"
                      aria-selected="true">
                      {{ $t('overwiew') }}
                    </button>
                    <button class="nav-link" id="nav-questions-tab" data-bs-toggle="tab" data-bs-target="#nav-questions"
                      type="button" role="tab" aria-controls="nav-questions" aria-selected="false">
                      {{ $t('qr') }}
                    </button>
                    <button class="nav-link" id="nav-notes-tab" data-bs-toggle="tab" data-bs-target="#nav-notes"
                      type="button" role="tab" aria-controls="nav-notes" aria-selected="false">
                      {{ $t('note') }}
                    </button>
                    <button class="nav-link" id="nav-reviews-tab" data-bs-toggle="tab" data-bs-target="#nav-reviews"
                      type="button" role="tab" aria-controls="nav-reviews" aria-selected="false">
                      {{ $t('reviews') }}
                    </button>
                    <button class="nav-link" id="nav-learning-tab" data-bs-toggle="tab" data-bs-target="#nav-learning"
                      type="button" role="tab" aria-controls="nav-learning" aria-selected="false">
                      {{ $t('griot_learning_tools') }}
                    </button>
                  </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                  <div class="tab-pane fade gd-sm" id="nav-course" role="tabpanel" aria-labelledby="nav-profile-tab ">
                    <course-content v-if="isPractice" :records="course.practiceTestProgressions" is-practice-test
                      @selected-practice="selectedPt"></course-content>
                    <course-content v-else :records="course.sectionsProgressions"
                      @selected-lecture="selectedLecture"></course-content>
                  </div>
                  <div class="tab-pane fade show active" id="nav-overview" role="tabpanel"
                    aria-labelledby="nav-home-tab">
                    <!--About this course-->
                    <div class="g-course-overview">
                      <div class="block-item">
                        <div class="block-item-title">
                          <span>{{ $t('about_course') }}</span>
                        </div>
                        <div class="block-item-Subtitle">
                          <span>{{ originalCourse.subTitle }}</span>
                        </div>
                      </div>
                      <!--Aby numbers-->
                      <div class="block-item">
                        <div class="row">
                          <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">
                            <span>{{ $t('by_number') }}</span>
                          </div>
                          <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">
                            <span>{{ $t('skill_level') }}: {{ originalCourse.level }}</span>
                            <br />
                            <span>{{ $t('students') }}:
                              {{ originalCourse.totalStudents }}</span><br />
                            <span>{{ $t('languages') }}: {{ originalCourse.language }}</span><br />
                            <span>{{ $t('captions') }}:
                              {{ $t(originalCourse.captions ? "Yes" : "No") }}</span>
                          </div>
                          <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">
                            <span v-if="originalCourse.type === 'Course'">{{ $t('Lectures') }}: {{
                              originalCourse.totalLectures
                            }}</span><br />
                            <span v-if="originalCourse.duration">Video:
                              {{ Math.floor(originalCourse.duration / 60) }}
                              min</span><br />
                          </div>
                        </div>
                      </div>
                      <!--Features-->
                      <div class="block-item">
                        <div class="row">
                          <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">
                            <span>{{ $t('Features') }}</span>
                          </div>
                          <div class="col-sm-12 col-md-8 col-xl-8 col-lg-8">
                            <span>
                              {{ $t('available_on') }} <a href="#">iOS</a>,
                              <a href="#">Desktop</a> {{ $t('and') }}
                              <a href="#">Android</a></span>
                          </div>
                        </div>
                      </div>
                      <!--Description-->
                      <div class="block-item">
                        <div class="row">
                          <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">
                            <span>{{ $t('Description') }}</span>
                          </div>
                          <div class="col-sm-12 col-md-8 col-xl-8 col-lg-8">
                            <span v-html="originalCourse.description"></span>
                            <br />
                            <br />
                            <div>
                              <span class="mt-2"><strong>{{ $t('What you’ll learn') }}</strong></span>
                              <ul class="mb-2">
                                <li v-for="(l, i) in originalCourse.objectives" :key="i">
                                  {{ l.value }}
                                </li>
                              </ul>
                              <span><strong>{{ $t('prerequired_message') }}</strong></span>
                              <ul class="mb-2">
                                <li v-for="(l, i) in originalCourse.requirements" :key="i">
                                  {{ l.value }}
                                </li>
                              </ul>
                              <span><strong>{{ $t('for_course') }}:</strong></span>
                              <ul class="mb-2">
                                <li v-for="(l, i) in originalCourse.courseFor" :key="i">
                                  {{ l.value }}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!--Instructor-->
                      <div class="block-item">
                        <div class="row">
                          <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">
                            <span>{{ $t('instructor') }}</span>
                          </div>
                          <div class="col-sm-12 col-md-8 col-xl-8 col-lg-8">
                            <profile-avatar :img="originalCourse.instructor?.picture"
                              :title="originalCourse.instructor?.name" :sub-title="originalCourse.instructor?.headLine"
                              @click="gotoInstructorProfile" />
                            <br />
                            <span v-html="originalCourse.instructor?.biography">
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="nav-notes" role="tabpanel" aria-labelledby="nav-profile-tab">
                    ...
                  </div>
                  <div class="tab-pane fade" id="nav-reviews" role="tabpanel" aria-labelledby="nav-contact-tab">
                    <g-reviews :course="originalCourse" />
                  </div>
                  <div class="tab-pane fade" id="nav-learning" role="tabpanel" aria-labelledby="nav-contact-tab">
                    <div class="griot-learningTools">
                      <learning-tools />
                    </div>
                  </div>
                  <div class="tab-pane fade" id="nav-questions" role="tabpanel" aria-labelledby="nav-questions-tab">
                    <g-question :course="originalCourse" :lecture="currentLecture" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3 col-sm-12 col-lg-3 col-xl-3 gd-lg">
              <div class="control-content">
                <div class="course_content" v-if="!closed">
                  <!-- Course Syllabus -->
                  <p class="content-header">
                    <span>{{ $t('course_content') }}</span>
                    <span @click="contentVisibility" style="cursor: pointer"><i class="bi bi-x-lg"></i></span>
                  </p>
                  <course-content v-if="isPractice" :records="course.practiceTestProgressions"
                    @selected-practice="selectedPt" is-practice-test ref="content" />
                  <course-content v-else :records="course.sectionProgressions" @selected-lecture="selectedLecture" />
                </div>
              </div>
            </div>
          </div>
          <div v-if="closed" class="g_position_bt g-box-shadow" @mouseover="showContentMessage = true"
            @mouseleave="showContentMessage = false">
            <span @click="contentVisibility"><i class="bi bi-arrow-left fs-5"></i>
              <span v-if="showContentMessage" class="ms-2">{{ $t('course_content') }}</span>
            </span>
          </div>
        </div>
      </template>
    </template>
    <g-social-media-share v-if="sharing" ref="shareModal" @close="shared" :id="'shareModal_' + courseId" />
    <g-add-review v-if="addingReview" :id="'addReview' + courseId" ref="addReview" @close="closeAddReview"
      :course-id="course.course.id" :course-progression-id="courseId" :review="course.review" />
  </template>
</template>
<script setup>
import { COURSE_TYPE, LEARNING_STATUS } from "../../resources/utilityConstant";
import store from "../../store";
import router from "../../router";
import { getCoursesProgressionById } from "../../database/griot";
import { computed, defineAsyncComponent, ref } from "vue";
import GQuestionPlay from "./GQuestionPlay.vue";
const StarsRating = defineAsyncComponent(() =>
  import("../../resources/RatingStar.vue")
);
const PlayCourse = defineAsyncComponent(() => import("../PlayCourse.vue"));
const GSpinner = defineAsyncComponent(() =>
  import("../../resources/GSpinner.vue")
);
const ProfileAvatar = defineAsyncComponent(() =>
  import("../../resources/ProfileAvatar.vue")
);
const GSocialMediaShare = defineAsyncComponent(() =>
  import("../../resources/GSocialMediaShare.vue")
);
const GReviews = defineAsyncComponent(() =>
  import("../../resources/GReviews.vue")
);
const GAddReview = defineAsyncComponent(() =>
  import("../../resources/GAddReview.vue")
);
const GQuestion = defineAsyncComponent(() =>
  import("../../resources/GQuestion.vue")
);
const GQuiz = defineAsyncComponent(() =>
  import("./GQuiz.vue")
);
const CourseContent = defineAsyncComponent(() => import("./CourseContent.vue"));
const PracticeTestTile = defineAsyncComponent(() =>
  import("./PracticeTestTile.vue")
);
const LearningTools = defineAsyncComponent(() =>
  import("../student/LearningTools.vue")
);

const loading = ref(true);
const courseId = ref(null);
const course = ref(null);
const action = ref(null);
const ptId = ref(null);
const addReview = ref(null);
const shareModal = ref(null);
const currentLecture = ref(null);
const addingReview = ref(false);
const sharing = ref(false);
const currentPracticeTest = ref(null);
const playTest = ref(false);
const user = computed(() => {
  return store.state.user;
});
const isPractice = computed(() => {
  return originalCourse.value.type === COURSE_TYPE.practiceTest;
});
const originalCourse = ref(null);
const onBegin = () => {
  playTest.value = true;
};
const getParameters = () => {
  const params = router.currentRoute.value.params;
  const query = router.currentRoute.value.query;
  courseId.value = params?.id;
  action.value = query?.action;
  ptId.value = query?.practice;
};
const getCoursesProgressionLocal = (restart) => {
  getCoursesProgressionById(user.value.id, courseId.value, action.value ?? '')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      course.value = result;
      originalCourse.value = result.course;
      //course.value.practiceTestProgressions = result.course.practiceTestProgressions?.sort((a, b) => (a.session.position > b.session.position) ? 1 : ((b.session.position > a.session.position) ? -1 : 0));
      if (originalCourse.value.type === COURSE_TYPE.practiceTest) {
        if (restart) {
          currentPracticeTest.value = course.value.practiceTestProgressions[0];
        }
      } else {
        course.value.sectionProgressions = result.sectionProgressions?.sort((a, b) => (a.session.position > b.session.position) ? 1 : ((b.session.position > a.session.position) ? -1 : 0))
        course.value.sectionProgressions.forEach(e => {
          e.lectureProgressions = e.lectureProgressions.sort((a, b) => (a.lecture.position > b.lecture.position) ? 1 : ((b.lecture.position > a.lecture.position) ? -1 : 0));
        })
        if (restart) {
          currentLecture.value =
            course.value.sectionProgressions[0].lectureProgressions[0];
        }
      }
      loading.value = false;
    })
    .catch((error) => {
      console.log("error==>getCoursesProgressionLocal", error);
      loading.value = false;
    });
};
/** get the event to user and start the learning of the next lecture*/
const nextLecture = (refresh) => {
  if (refresh) {
    getCoursesProgressionLocal(false);
  }
  const section = course.value.sectionProgressions.filter(
    (s) => s.id == currentLecture.value.sectionProgressionId
  )[0];
  const currentLectureIndex = section.lectureProgressions.findIndex(
    (e) => e.id === currentLecture.value.id
  );
  if (currentLectureIndex + 1 < section.lectureProgressions.length) {
    currentLecture.value = section.lectureProgressions[currentLectureIndex + 1];
  } else {
    const currentSectionIndex = course.value.sectionProgressions.findIndex(
      (e) => e.id === section.id
    );
    if (currentSectionIndex + 1 < course.value.sectionProgressions.length) {
      currentLecture.value =
        course.value.sectionProgressions[
          currentSectionIndex + 1
        ].lectureProgressions[0];
    } else {
      currentLecture.value =
        course.value.sectionsProgressions[0].lecturesProgressions[0];
    }
  }
};
const selectedLecture = (lecture) => {
  currentLecture.value = lecture;
};
/** get the event to manage practice test */
const selectedPt = (pt) => {
  currentPracticeTest.value = pt;
};
const previousLecture = (progression) => {
  console.log("datatata");
};
/** Review and share**/
const leaveRating = () => {
  addingReview.value = true;
  addReview.value.show();
};
const closeAddReview = () => {
  addingReview.value = false;
  addReview.value.hide();
};
const testFinished = () => {
  playTest.value = false;
  getCoursesProgressionLocal(true);
};
const onRetake = () => {
  playTest.value = true;
};

/** start
 * */
getParameters();
getCoursesProgressionLocal(true);
</script>
<script>
import { LEARNING_STATUS } from "../../resources/utilityConstant";

export default {
  data: function () {
    return {
      pageItems: [],
      closed: false,
      showContentMessage: false,
      ptId: null,
      styleConfig: {
        fullStarColor: "#ed8a19",
        emptyStarColor: "#737373",
        starWidth: 20,
        starHeight: 20,
      },
      action: null,
      currentPracticeTest: null,
    };
  },
  methods: {
    gotoInstructorProfile() {
      router.push({
        name: "InstructorView",
        params: { id: this.originalCourse.instructor.id },
      });
    },
    share() {
      this.$refs.shareModal.show();
    },
    shared() {
      this.$refs.shareModal.hide();
    },

    onFullscreen() { },
    onExpand(isExpand) {
      this.closed = isExpand;
    },
    onNext() {
      const index = this.practiceTest.findIndex(
        (e) => e.id === this.currentPracticeTest.id
      );
      if (index !== -1 && index < this.practiceTest.length - 1) {
        this.currentPracticeTest = this.practiceTest[index + 1];
      } else {
        this.currentPracticeTest = this.practiceTest[0];
      }
      this.$refs.content.setCurrentItem(this.currentPracticeTest.id);
    },
    contentVisibility() {
      this.closed = !this.closed;
      this.$refs.question_player.isExpand = this.closed;
    },
  },
  beforeCreate() {
    store.dispatch("hideHeader");
  },
  beforeDestroy() {
    store.dispatch("showHeader");
  },
  computed: {
    myLearningPath() {
      return (
        COLLECTION_NAME.user +
        "/" +
        this.user.id +
        "/" +
        COLLECTION_NAME.myLearnings
      );
    },
    practiceTestPath() {
      return (
        COLLECTION_NAME.course +
        "/" +
        this.originalCourse.id +
        "/" +
        COLLECTION_NAME.practice_test
      );
    },
  },
};
</script>

<style scoped>
.content-header {
  font-weight: 900;
  font-family: sans-serif;
  font-size: 1em;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1em;
  padding: 0 1.3rem;
}

.course_content {
  position: fixed;
  width: 50vh;
  top: 6%;
  height: 100%;
  overflow: scroll;
  border-left: 0.001em solid hsl(0, 0%, 50%, 0.1);
  box-shadow: -1px 0 1px 1px hsl(0, 0%, 67%, 0.1);
}

.g_position_bt {
  padding: 0;
  position: fixed;
  top: 20%;
  right: -0.1%;
  border: 1px gray solid;
  padding: 0.2em;
  background-color: darkgray;
  color: white;
  font-size: large;
  font-weight: bolder;
  cursor: pointer;
}

.g-header-text {
  font-size: 1em;
  cursor: pointer;
  font-family: sans-serif;
  font-stretch: extra-expanded;
  font-size: 1em;
}

input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 3px solid #0a0809;
  border-radius: 0;
  width: 16px;
  height: 16px;
  outline: none;
  position: relative;
  transition: border-color 0.3s ease-in-out;
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
  padding-bottom: 0;
  display: block;
  font-size: 16px;
  line-height: 20;
  text-align: center;
}

input[type="checkbox"]:focus {
  border-color: blue;
}

input[type="checkbox"]:checked:focus {}

input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 1;
}

.control-content {
  position: relative;
  width: 100%;
  padding: 0 !important;
}

.col-md-8,
.col-sm-12,
.col-lg-8,
.col-xl-8 {
  padding: 0 !important;
}

.g-course-overview {
  padding: 1em 0;
  font-family: sans-serif;
}

.g-course-overview .block-item {
  padding: 1.5em 2em;
  border-bottom: 0.01em solid hsl(0, 0%, 50%, 0.2);
}

.g-course-overview .block-item .block-item-title {
  font-weight: 900;
  font-family: sans-serif;
  font-size: 1.7em;
  margin-bottom: 0.5em;
}

.g-course-overview .block-item .block-item-Subtitle {
  font-weight: 700;
}

.block-item a {
  color: var(--g-color-item);
  font-weight: 700;
  text-decoration-line: none;
}

.g-course-tabs {
  padding: 0.3em 1.3rem;
}

.nav-tabs .nav-link {
  border-radius: 0 !important;
  border: none;
  color: var(--g-c-blue-dark);
  font-family: sans-serif;
  font-size: 0.95em;
  font-weight: 900;
  opacity: 0.8;
}

.nav-tabs .nav-link.active {
  color: var(--g-c-blue-dark);
  border-bottom: 2px solid var(--g-c-blue-dark);
  opacity: 0.9;
}

.nav-tabs .nav-link:hover {
  opacity: 0.9;
}

.g-header-text-small {
  font-size: 0.7em;
}

.g-header-text-title {
  font-size: 1.5em !important;
}

.navbar {
  padding: 0 !important;
}

.griot-learningTools {
  padding: 1em 3em;
}

.g-pointer {
  cursor: pointer;
}

.g-logo {
  height: 1.5em;
}

@media only screen and (max-width: 37.5em) {
  .griot-learningTools {
    padding: 1em 0em;
  }
}

@media only screen and (max-width: 23.44em) {
  .griot-learningTools {
    padding: 1em 0em;
  }
}
</style>
