<template>
  <div class="g-course-view" v-if="!loading">
    <div class="g-course-overview-header">
      <div class="container-md">
        <div class="row justify-content-start">
          <div class="g-course-overview-header-content col-md-9 col-sm-12">
            <!-- course video image palye-->
            <div class="gd-sm">
              <div class="card">
                <img v-if="course.picture" class="card-img-top" :src="course.picture" alt="Card image"
                  title="Course image" />
                <img v-else src="./../../assets/images/logo.png" class="card-img-top" alt="Card image"
                  title="Course image" />
                <!--<div class="card-img-overlay">
                    <div>
                      <p class="icon" @click="continueLearning">
                        <i class="bi bi-play-circle-fill fs-1"></i>
                      </p>
                    </div>
                  </div>-->
              </div>
            </div>
            <div class="g-course-overview-header-title">
              {{ course.title }}
            </div>
            <div class="g-course-overview-header-subtitle">
              {{ course.subTitle }}
            </div>
            <div class="g-course-overview-header-summary">
              <span class="rating"><i class="bi bi-star-fill" title="reviews"></i>
                {{ course.reviews }}/5
              </span>
              <span class="enrolled"><i class="bi bi-mortarboard-fill" title="Enrolled students"></i>
                {{ course.totalStudents }} {{ $t("Enrolled") }}
              </span>
              <span class="level"><i class="bi bi-reception-4" title="level"></i>
                {{ $t(course.level) }}</span>
              <span class="lastUpdate"><i class="bi bi-patch-exclamation-fill" title="Last published date"></i>
                {{ $t("Last Updated") }}
                {{ getLastUpdated }}
              </span>
              <span class="language"><i class="bi bi-globe" title="Language"></i>
                {{ course.language }}
              </span>
              <span class="lecture"><i class="bi bi-book-fill"></i> {{ course.totalLectures }}
                {{ $t("Lectures") }}
              </span>
              <span class="totalHours"><i class="bi bi-alarm-fill"></i>
                {{ $t(convertSecondsToTime(course.totalDurations)) }}
              </span>
            </div>
            <!-- Course price and add product to card-->
            <div class="col-12 gd-sm">
              <div v-if="!alreadySubscribe" class="price_card">
                <span class="total"> {{ $t(price) }} </span><span class="discount ms-3"
                  v-if="(price !== 'Free' && price !== originalprice)">{{ originalprice }}</span>
                <div class="row mt-2">
                  <div class="col-8">
                    <button class="button-add-to-cart" @click="addProductToCatalog" :disabled="isSaving"
                      title="Add product to cart">
                      <spinner-cmp v-if="isSaving" />
                      {{ $t('add_to_cart') }}
                    </button>
                  </div>
                  <div class="col-4" style="text-align: center">
                    <spinner-cmp v-if="isSavingWish" />
                    <i class="bi-heart fs-2" v-if="!isWhist" @click="addToMyWhistList"></i>
                    <i class="bi-heart-fill fs-2 whistActive" v-if="isWhist" @click="removeToMyWhistList"></i>
                  </div>
                  <div class="col-12 mt-4">
                    <button class="button" @click="checkOut" :disabled="isCreating">
                      <spinner-cmp v-if="isCreating" />{{ $t('buy_now') }}
                    </button>
                  </div>
                  <div class="col-12 mt-2" style="text-align: center; margin: 0.5em 0">
                    {{ $t('30-Day Money-Back Guarantee') }}
                  </div>
                </div>
              </div>
              <div v-else class="subscribed">
                <span>{{ $t('already_take_course') }}</span>
                <button @click="continueLearning" :disabled="isContinue">
                  <spinner-cmp v-if="isContinue" />
                  {{ $t('continue_learning') }} <i class="bi bi-youtube"></i>
                </button>
              </div>
            </div>
            <!--- en of the process-->
          </div>
        </div>
      </div>
    </div>
    <div class="g-course-overview-content container-md">
      <div class="row">
        <div class="col-sm-12 col-md-8">
          <g-tabs-simple :tabs="tabsCat" ref="catTabs" @selected="select" />
          <template v-if="isLoading">
            <div class="list--spinner">
              <spinner-cmp color="text-black" />
            </div>
          </template>
          <template v-else>
            <template v-if="isError">
              <div class="search-result--empty">
                <i class="bi bi-intersect"></i>
                <span>
                  <strong>{{ $t("errorLoading") }}</strong>
                </span>
              </div>
            </template>
          </template>
          <div class="g-course-overview-content-course-details">
            <template v-if="selectedCatTab.name === 'Overview'">
              <div class="tab-pane fade show active" id="pills-overview">
                <div class="g-course-overview-content-overview">
                  <div class="tab-title">{{ $t("Course Description") }}</div>
                  <div class="g-heading-details--space" disabled="true" v-html="course.description"></div>
                  <div class="tab-title g-heading-serif-lg">
                    {{ $t("What you’ll learn") }}
                  </div>
                  <div class="row ps-4">
                    <span class="mt-2 col-6" v-for="ob in course?.objectives" :key="ob.name">
                      <span class="icon">&#9830;&#160;&#160;</span>{{ ob.value }}</span>
                  </div>
                  <div class="tab-title">
                    {{ $t("Who is this course for?") }}
                  </div>
                  <div class="row ps-4">
                    <template v-if="course.courseFor && course.courseFor.length > 0">
                      <span class="mt-2 col-6" v-for="cFor in course.courseFor" :key="cFor.name">
                        <span class="icon">&#9830;&#160;&#160;</span>{{ cFor.value }}</span>
                    </template>
                    <template v-else>
                      <span>
                        {{ $t("this course is for everyone") }}
                      </span>
                    </template>
                  </div>
                  <div class="tab-title">{{ $t("Requirements") }}</div>
                  <div class="row ps-4">
                    <template v-if="
                      course.requirements && course.requirements.length > 0
                    ">
                      <span class="mt-2 col-6" v-for="req in course.requirements" :key="req.name">
                        <span class="icon">&#9830;&#160;&#160;</span>{{ req.value }}</span>
                    </template>
                    <template v-else>
                      <span>{{ $t("No requirement need") }}</span></template>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="selectedCatTab.name === 'Curriculum'">
              <div class="" id="pills-curriculum" role="tab">
                <div class="g-accordion mt-2 mb-5">
                  <template v-if="course.type == COURSE_TYPE.practiceTest">
                    <div class="g-accordion-item" v-for="(section, i) in course.practiceTests" :key="section.id">
                      <div class="g-accordion-item-header">
                        <div class="g-accordion-item-header-title--practice">
                          <div class="">
                            <i class="bi bi-question-circle"></i>&nbsp;&nbsp;&nbsp;{{ $t('Practice Test') }} {{ i + 1
                            }}:
                            {{ section.title }}
                          </div>
                          <div class="g-section-item-tile-practice g-text-md">
                            <span><i class="bi bi-question-diamond"></i>
                              {{ section.totalQuestions }} {{ $t('Questions') }}</span>
                            |

                            <span>
                              <i class="bi bi-clock-history"></i>
                              {{ Math.floor(section.duration) }}
                              min</span>
                            <span>
                              | {{ $t('required_score') }} : {{ section.minimumScore }} %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="g-accordion-item" v-for="(section, i) in course.sections " :key="section.id">
                      <div class="g-accordion-item-header" @click="toggleItem(i)">
                        <div class="g-accordion-item-header-title">
                          <div class="">
                            {{ $t('section') }} {{ section.position }}: {{ section.title }}
                          </div>
                          <div class="g-section-item-tile">
                            <span><i class="bi bi-book-fill"></i>
                              {{ section.totalLectures }} {{ $t('Lectures') }}</span>
                            |

                            <span>
                              <i class="bi bi-clock-fill"></i>
                              {{ Math.floor(section.totalDurations / 60) }}
                              min</span>
                          </div>
                        </div>
                        <span class="g-accordion-item-header-icon"><i class="bi bi-chevron-down"
                            v-if="!section.active"></i>
                          <i class="bi bi-chevron-up" v-else></i></span>
                      </div>
                      <div class="g-accordion-el" v-if="section.active">
                        <div
                          v-for="(lecture, index) in section.lectures.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0))"
                          :key="index" :data-id="section.id">
                          <div class="g-lecture-item" :ref="lecture.id" v-if="lecture.type === 'Lecture'">
                            <div class="g-lecture-item-title">
                              <div class="title">
                                <div class="me-2">
                                  <i class="video bi bi-play-btn-fill me-1" v-if="lecture.documentType === 'Video'"></i>
                                  <i class="article bi bi-file-richtext-fill me-1"
                                    v-if="lecture.documentType === 'Article'"></i>
                                </div>
                                <span>{{ lecture.title }}</span>
                              </div>
                              <div class="ps-4 g-lecture-item-tile">
                                <span>
                                  {{
                                    lecture.duration
                                      ? Math.floor(lecture.duration / 60)
                                      : 0
                                  }}min
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="g-lecture-item" :ref="lecture.id" v-if="lecture.type === 'Quiz'">
                            <div class="g-lecture-item-title">
                              <div class="title">
                                <div class="me-2">
                                  <i class="bi bi-question-circle me-1"></i>
                                </div>
                                <span>{{ lecture.title }}</span>
                              </div>
                              <div class="ps-4 g-lecture-item-tile">
                                <span>
                                  {{ }} {{ $t("Questions") }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>
            <template v-if="selectedCatTab.name === 'Reviews'">
              <div class="tab" id="pills-reviews" role="tabpanel" aria-labelledby="pills-reviews-tab">
                <g-reviews :course="course" />
              </div>
            </template>
            <template v-if="
              selectedCatTab.name === 'Instructor' &&
              instructor &&
              instructor.id
            ">
              <div class="tab" id="pills-instructor" role="tabpanel">
                <div class="instructor">
                  <div class="instructor_header">
                    <div class="image">
                      <a :href="'/user/' + instructor?.id">
                        <img v-if="instructor.picture" :src="instructor.picture" alt="image" class="user-image"
                          :title="instructor.name" />
                        <img v-else alt="image" class="user-image" :title="instructor.name"
                          src="../../assets/images/logo/png-transparent-traditional-african-masks-headgear-totem-character-mask-business-shoe-mask.png" /></a>
                    </div>
                    <div class="resume">
                      <div class="title">{{ instructor?.name }}</div>
                      <div class="subTitle">
                        {{ instructor.headLine }}
                      </div>
                      <div class="icon">
                        <a :href="instructor.website" v-if="instructor.website"><i class="bi bi-link me-2"> </i></a>
                        <a :href="'https://www.facebook.com/' + instructor.facebook" v-if="instructor.facebook"><i
                            class="bi bi-facebook me-2"></i></a>
                        <a :href="'https://www.linkedin.com/' + instructor.linkedIn" v-if="instructor.linkedIn"><i
                            class="bi bi-linkedin me-2"></i></a>
                        <a :href="'https://www.twitter.com/' + instructor.twitter" v-if="instructor.twitter"><i
                            class="bi bi-twitter-x me-2"></i></a>
                        <a :href="'https://www.youtube.com/' + instructor.youtube" v-if="instructor.youtube"><i
                            class="bi bi-youtube me-2"></i></a>

                      </div>
                      <div class="total">
                        <span class="enrolled" :title="$t('students')"><i class="bi bi-mortarboard-fill me-2"></i>
                          {{ instructor.totalStudents }}</span>
                        <span class="rating" v-if="instructor.totalReviews > 0" :title="$t('reviews')"><i
                            class="bi bi-star-fill me-2"></i> {{ instructor.totalReviews }}</span>
                        <span class="course" :title="$t('Course')"><i class="bi bi-play-circle-fill me-2"></i>{{
                          instructor.totalCourses }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="instructor_description">
                    <div class="g-heading-details">{{ $t('about_instructor') }}</div>
                    <div v-html="instructor.bio"></div>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="selectedCatTab.name === 'FAQs'">
              <div class="tab-pane" id="pills-faq" role="tab">
                <g-question :show-add-button="false" :course="course" />
              </div>
            </template>
          </div>
        </div>
        <div class="col-sm-12 col-md-4">
          <div class="row">
            <div class="col-12 g-box-shadow mb-5 gd-md">
              <div class="video_demo">
                <div class="card gd-md">
                  <img v-if="course.picture" class="card-img-top" :src="course.picture" alt="Card image"
                    title="Course image" />
                  <img v-else src="./../../assets/images/logo.png" class="card-img-top" alt="Card image"
                    title="Course image" />
                  <div class="card-img-overlay" v-if="course.promotionalVideo">
                    <div>
                      <p class="icon" @click="continueLearning">
                        <i class="bi bi-play-circle-fill fs-1"></i>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!alreadySubscribe" class="price_card">
                <span class="total"> {{ $t(price) }} </span><span class="discount ms-3"
                  v-if="(price !== 'Free' && price !== originalprice)">{{ originalprice }}</span>
                <div class="row mt-2">
                  <div class="col-8">
                    <button class="button-add-to-cart" @click="addProductToCatalog" :disabled="isSaving"
                      title="Add product to cart">
                      <spinner-cmp v-if="isSaving" />
                      {{ $t('add_to_cart') }}
                    </button>
                  </div>
                  <div class="col-4" style="text-align: center">
                    <spinner-cmp v-if="isSavingWish" />
                    <i class="bi-heart fs-2" v-if="!isWhist" @click="addToMyWhistList"></i>
                    <i class="bi-heart-fill fs-2 whistActive" v-if="isWhist" @click="removeToMyWhistList"></i>
                  </div>
                  <div class="col-12 mt-4">
                    <button class="button" @click="checkOut" :disabled="isCreating">
                      <spinner-cmp v-if="isCreating" />{{ $t('buy_now') }}
                    </button>
                  </div>
                  <div class="col-12 mt-2" style="text-align: center; margin: 0.5em 0">
                    {{ $t('30-Day Money-Back Guarantee') }}
                  </div>
                </div>
              </div>
              <div v-else class="subscribed">
                <span>{{ $t('already_take_course') }}</span>
                <button @click="continueLearning" :disabled="isContinue">
                  <spinner-cmp v-if="isContinue" />
                  {{ $t('continue_learning') }} <i class="bi bi-youtube"></i>
                </button>
              </div>
            </div>

            <div class="col-12 g-box-shadow mb-5 pt-4 pb-4 ps-4 pe-4">
              <div class="col-12 course-value">
                <p class="title">{{ $t('this_course_include') }}</p>
                <div class="course-value-content">
                  <template v-if="course.type === COURSE_TYPE.course">
                    <div class="item">
                      <span><i class="bi-book-fill me-1"></i> {{ $t('Lectures') }}</span>
                      <span>{{ course.totalLectures }}</span>
                    </div>
                    <div class="item">
                      <span><i class="bi-collection-play-fill me-1"></i>{{ $t('hours_on_demand') }}</span>
                      <span>{{ $t(convertSecondsToTime(course.totalDurations)) }}</span>
                    </div>
                    <div class="item">
                      <span><i class="bi-files me-1"></i>{{ $t('Article') }}</span>
                      <span>1</span>
                    </div>
                    <div class="item">
                      <span>
                        <i class="bi-cloud-arrow-down-fill me-1"></i>
                        {{ $t('donwloable_ressource') }}</span>
                      <span>62</span>
                    </div>
                  </template>
                  <template v-if="course.type === COURSE_TYPE.practiceTest">
                    <div class="item">
                      <span><i class="bi bi-question-circle me-1"></i> {{ $t('practices_tests') }}</span>
                      <span>{{ course.totalLectures }}</span>
                    </div>
                  </template>
                  <div class="item">
                    <span><i class="bi-infinity me-1"></i>{{ $t('full_time_access') }}</span>
                    <span>{{ $t('yes') }}</span>
                  </div>
                  <div class="item">
                    <span><i class="bi-phone-fill me-1"></i>{{ $t('tv_access') }}</span><span>{{ $t('yes') }}</span>
                  </div>
                  <div class="item">
                    <span><i class="bi-trophy me-1"></i> {{ $t('certification_of_completion') }}</span><span>{{
                      $t('yes')
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <template v-if="loading">
      <g-spinner />
    </template>
  </div>
</template>
<script setup>
import router from "../../router";
import store from "../../store";
import { computed, defineAsyncComponent, ref, watch } from "vue";
import {
  appProducts,
  courseCheckEnrollment,
  createEnrollments,
  getCourseByIdPreview,
  getCourseProgressionByCourseId,
  getUser,
  updateWishList,
} from "../../database/griot";
import { generateUniqueId, getGuestUserId } from "../../database/guest_user/guest_user";
import {
  convertSecondsToTime,
  formatDateT,
  getCurrencyDefault,
} from "../../resources/UtilityFunction";
import { COURSE_TYPE } from "../../resources/utilityConstant";
const GTabsSimple = defineAsyncComponent(() =>
  import("../../resources/GTabsSimple.vue")
);
const SpinnerCmp = defineAsyncComponent(() =>
  import("../../resources/Spinner.vue")
);
const GSpinner = defineAsyncComponent(() =>
  import("../../resources/GSpinner.vue")
);
const GReviews = defineAsyncComponent(() =>
  import("../../resources/GReviews.vue")
);
const GQuestion = defineAsyncComponent(() =>
  import("../../resources/GQuestion.vue")
);

const loading = ref(true);
const courseId = ref(null);
const course = ref({});
const isSaving = ref(false);
const isSavingWish = ref(false);
const isCreating = ref(false);
const alreadySubscribe = ref(false);
const isContinue = ref(false);
const isError = ref(false);
const isLoading = ref(false);
const instructor = ref(null);
const referralCode = ref(null);
const tabsCat = [
  { name: "Overview", label: "Overview" },
  { name: "Curriculum", label: "Curriculum" },
  { name: "Instructor", label: "Instructor" },
  { name: "Reviews", label: "Reviews" },
  { name: "FAQs", label: "FAQs" },
];
const selectedCatTab = ref(tabsCat[0]);
const catTabs = ref(null);
const init = () => {
  catTabs.value.gotoTab(tabsCat[0].name);
};
const select = (tab) => {
  selectedCatTab.value = tab;
  if (
    tab.name === "Curriculum" &&
    course.value &&
    course.value.id &&
    (!course.value.sections || course.value.sections.length < 1) &&
    (!course.value.practiceTests || course.value.practiceTests.length < 1)
  ) {
    isLoading.value = true;
    getCourseLocal();
  } else if (tab.name === "Overview" && (!course.value || !course.value.id)) {
    getCourseLocal();
  } else if (tab.name === "Instructor" && !instructor.value) {
    getInstructorLocal();
  }
};
const getParameters = () => {
  const params = router.currentRoute.value.params;
  referralCode.value = router.currentRoute.value.query?.ref;
  if (params && params.id) {
    courseId.value = params.id;
    getCourseLocal();
    checkEnrollmentLocal();
  }
};
/**  this function is used to get courses local*/
const getCourseLocal = () => {
  loading.value = !isLoading.value;
  isError.value = false;
  const section =
    selectedCatTab.value.name === "Curriculum"
      ? course.value?.type === COURSE_TYPE.course
        ? "Curriculum"
        : "PracticeTest"
      : "Overview";

  getCourseByIdPreview(courseId.value, section ?? "")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (selectedCatTab.value.name === "Curriculum") {
        course.value.practiceTests = data.practiceTests?.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
        course.value.sections = [...data.sections].sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
      } else {
        course.value = data;
      }
      tabsCat[1].label = course.value?.type === COURSE_TYPE.course
        ? "Curriculum"
        : "Practice Test";
      loading.value = false;
      isLoading.value = false;
    })
    .catch((error) => {
      console.log("getCourseLocal", error);
      loading.value = false;
      isLoading.value = false;
      isError.value = true;
    });
};
const getInstructorLocal = () => {
  isLoading.value = true;
  isError.value = false;
  getUser(course.value.instructorId)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      instructor.value = data;
      isLoading.value = false;
    })
    .catch((error) => {
      console.log("getInstructorLocal", error);
      isLoading.value = false;
      isError.value = true;
    });
};
const toggleItem = (index) => {
  let itemsLocal = course.value.sections;
  console.log(index);
  itemsLocal[index].active = !itemsLocal[index].active;
  course.value.sections = [...itemsLocal];
};
const price = computed(() => {
  if (course.value.price.value === 0) {
    return 'Free'
  }
  return course.value.price_Display.price_string;
});
const originalprice = computed(() => {
  return course.value?.price_detail.price_string;
});
const user = computed(() => {
  return store.state.user;
});
const cart = computed(() => {
  return store.state.webCart;
});
const checkoutSession = computed(() => {
  return store.state.checkoutSession;
});
const getLastUpdated = computed(() => {
  return formatDateT(course.value.createdDate);
});
const addProductToCatalog = (checkoutNow) => {
  isSaving.value = true;
  let isGuestUser = false;
  let finalId;
  if (user.value && user.value.id) {
    finalId = user.value.id;
  } else {
    isGuestUser = true;
    generateUniqueId();
    finalId = getGuestUserId();
  }

  const request = {
    webCartId: cart.value?.id,
    ownerId: finalId,
    courseId: course.value.id,
    currencyCode: getCurrencyDefault(),
    isGuestUser: isGuestUser
  };
  appProducts(finalId, request)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      isSaving.value = false;
      store.dispatch("refreshCatalog", data);
      if (checkoutNow) {
        window.location.href = "/payment/checkout";
      } else {
        router.push({
          name: "catalog",
        });
      }
    })
    .catch((error) => {
      console.log("addProductToCatalog=> error", error);
      isSaving.value = false;
    });
};
/** this function is used to check out product*/
const checkOut = () => {
  isCreating.value = true;
  if (user.value && user.value.id) {
    if (course.value.price?.value === "0" || course.value.price?.value === 0) {
      freeCourse();
    } else {
      addProductToCatalog(true);
    }
  } else {
    router.push({
      name: "login",
      query: { next: "checkout", src: "course", courseId: courseId.value },
    });
  }
};
/**Manage wish list **/
const isWhist = computed(() => {
  if (user.value && user.value.id) {
    if (user.value.wishList && user.value.wishList.length > 0) {
      if (user.value.wishList.some((e) => e.courseId === courseId.value))
        return true;
    }
  }
  return false;
});
const addToMyWhistList = () => {
  wishListLocal("A");
};
const removeToMyWhistList = () => {
  wishListLocal("R");
};
const freeCourse = () => {
  const request = {
    sessionId: "",
    paymentStatus: "paid",
    studentId: user.value.id,
    ownerId: user.value.id,
    priceId: course.value.stripePriceId,
    amountTotal: 0,
    amountDiscount: 0,
    amountShipping: 0,
    amountTax: 0,
    amountSubtotal: 0,
    quantity: 1,
    LineItemId: "",
    webCartId: "",
    referralCode: referralCode.value,
  };
  //console.log("enrollment record", [request]);
  createEnrollments([request])
    .then((response) => {
      //console.log("CompleteEnrollmentsLocal===>response", response);
      return response.json();
    })
    .then((data) => {
      //console.log("CompleteEnrollmentsLocal===>data", data);
      store.dispatch("resetCheckoutSession");
      router.push({
        name: "StudentDashboard",
        params: { item: "MyLearning" },
      });
    })
    .catch((error) => {
      isCreating.value = false;
      //console.log("CompleteEnrollmentsLocal==>error", error);
    });
};
const wishListLocal = (action) => {
  isSavingWish.value = true;
  updateWishList(user.value.id, courseId.value, action)
    .then((response) => {
      //console.log("response==>wishListLocal", response);
      return response.json();
    })
    .then((result) => {
      //console.log("result==>wishListLocal", result);
      store.dispatch("refreshUser", user.value.id);
      isSavingWish.value = false;
    })
    .catch((error) => {
      //console.log("error==>wishListLocal", error);
      isSavingWish.value = false;
    });
};
/** check user enrollment**/
const checkEnrollmentLocal = () => {
  if (user.value && user.value.id) {
    courseCheckEnrollment(courseId.value, user.value.id)
      .then((response) => {
        //console.log("checkEnrollmentLocal", response);
        return response.json();
      })
      .then((result) => {
        //console.log("checkEnrollmentLocal===>result", result);
        alreadySubscribe.value = result;
      })
      .catch((error) => {
        console.log("error==>", error);
      });
  }
};
const redirectTo = (link) => {
  window.open(link);
};
const continueLearning = () => {
  isContinue.value = true;
  getCourseProgressionByCourseId(user.value.id, courseId.value)
    .then((response) => {
      //console.log("getCourseProgressionByCourseId", response);
      return response.json();
    })
    .then((result) => {
      //console.log("getCourseProgressionByCourseId===>result", result);
      isContinue.value = false;
      router.push({
        name: "learnView",
        params: { id: result.id },
        query: {
          action:
            result.course.type === COURSE_TYPE.practiceTest ? "practice" : "",
        },
      });
    })
    .catch((error) => {
      isContinue.value = false;
      //console.log("getCourseProgressionByCourseId==>error", error);
    });
};
/***
 * start all changes
 */
getParameters();
watch(
  () => catTabs.value,
  () => {
    init();
  }
);
</script>

<style scoped>
.g-course-overview-header {
  background-color: #f5f7f9;
  padding: 5em 0;
  font-family: sans-serif;
}

.g-course-overview-header-content {
  display: flex;
  flex-direction: column;
}

.g-course-overview-header-title {
  font-size: 3em;
  font-weight: 1000;
  color: var(--g-c-blue-dark);
  margin: 0.2em 0;
}

.g-course-overview-header-subtitle {}

.g-course-overview-header-summary {
  margin: 0.8em 0;
}

.g-course-overview-header-summary span {
  margin: 0 0.5em;
  font-weight: 700;
}

.g-course-overview-header-summary span.rating i {
  color: #e8e805;
}

.g-course-overview-header-summary span.enrolled i {
  color: orange;
}

.g-course-overview-header-summary span.level i {
  color: green;
}

.g-course-overview-header-summary span.lastUpdate i {
  color: red;
}

.g-course-overview-header-summary span.language i {
  color: #0b0b5d;
}

.g-course-overview-header-summary span.lecture i {
  color: blue;
}

.g-course-overview-header-summary span.totalHours i {
  color: violet;
}

.g-course-overview-content {
  padding: 3em 0;
}

.g-course-overview-content-course-details {
  padding: 0.5em 1em;
}

.tab-title {
  font-weight: 700;
  font-family: sans-serif;
  margin: 0.7em 0;
  font-size: 1.1em;
}

.description-content {
  font-size: 1.1em;
  font-family: sans-serif;
}

.g-course-overview-content-overview {
  margin: 2em 1em;
}

.g-course-overview-content-overview span.icon {
  color: var(--griot-primary);
}

h1 {
  font-weight: bolder;
}

li {
  font-size: large;
}

ul {
  list-style-type: circle;
  margin-bottom: 4em;
  margin-top: 2em;
}

ul {
  --icon-space: 1.3em;
  list-style: none;
  padding: 0;
}

.button-add-to-cart {
  background-color: var(--g-c-text-home);
  padding: 0.5em 2em;
  border: 1px var(--g-c-text-home) solid;
  color: white;
  font-weight: bold;
  width: 100%;
}

.button {
  padding: 0.5em 2em;
  border: 1px var(--g-c-text-home) solid;
  color: black;
  font-weight: bold;
  width: 100%;
}



.nav-link {
  margin: 0.2em 1em;
  border-radius: 0;
}

.nav-link.active {
  border-radius: 0;
  background-color: var(--g-c-blue-dark) !important;
}

.nav-link:hover {
  background-color: var(--g-c-blue-dark) !important;
  border-radius: 0;
}

.g-accordion-el {
  line-height: 26px;
  font-family: sans-serif;
  font-size: 1.1em;
}

.g-lecture-item-title {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
}

.g-lecture-item-title .title {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.g-lecture-item-tile {
  font-size: 0.7em !important;
  font-weight: 10 !important;
  font-family: "Arial Narrow" !important;
}

.g-lecture-item {
  cursor: pointer;
  width: 100%;
  font-family: Poppins;
  font-size: 1em;
  padding: 0.5em 1rem;
  margin-top: 0.2rem;
}

.g-lecture-item i.video {
  color: #0a58ca;
}

.g-lecture-item i.article {
  color: red;
}

.g-lecture-item:hover {
  background-color: hsl(198, 24%, 42%, 0.3);
}

.g-accordion-item {
  border-top: none;
  margin-bottom: 1em;
}

.course-value {}

.course-value .title {
  text-align: center;
  font-family: sans-serif;
  font-size: 1.2em;
  font-weight: 900;
}

.course-value .course-value-content .item {
  display: flex;
  justify-content: space-between;
  margin: 0.6em 0;
  font-family: sans-serif;
  font-size: 1.1em;
}

.course-value .course-value-content .item i {
  color: var(--griot-primary);
}

.video_demo {
  margin-top: -11.5em;
  margin-left: -0.45em;
  margin-right: -0.45em;
}

.card-img-overlay {
  background-color: rgb(45, 45, 45, 0.4);
  height: 16em;
  border-radius: 0px !important;
}

.card-img-overlay .icon {
  text-align: center;
  padding-top: 20%;
  color: var(--bs-white);
}

.icon .bi {
  font-size: 2em !important;
}

.dots {
  background-color: white;
}

.card {
  border: none !important;
  cursor: pointer;
  margin-top: 2em !important;
}

.price_card {
  padding: 2em 0;
}

.price_card .total {
  font-family: sans-serif;
  font-weight: 900;
  font-size: 1.3em;
}

.instructor {
  padding: 0.5em 2em;
}

.instructor_description {}

.instructor_description .title {
  font-weight: 900;
  font-size: 2em;
  margin: 0.5em 0;
}

.instructor_header {
  display: flex;
  flex-direction: row;
}

.instructor_header .image {
  width: 40%;
}

.instructor_header .resume .title {
  font-weight: 900;
  font-size: 1em;
  font-family: sans-serif;
  margin: 0.5em 0;
}

.instructor_header .resume .subTitle {}

.instructor_header .resume .total span.enrolled i {
  color: grey;
  /****border: 0.1em solid rgb(255, 0, 0, 0.2);
  border-radius: 50%;
  padding: 0.4em 0.4em;
  margin-right: 0.5em;
  background-color: rgb(255, 0, 0, 0.2); */
}

.instructor_header .resume .total span.rating i {
  color: yellow;
  margin-right: 0.5em;
  margin-left: 0.5em;
  /**border: 0.1em solid rgb(255, 255, 0, 0.2);
  border-radius: 50%;
  padding: 0.4em 0.4em;
  
  background-color: rgb(255, 255, 0, 0.2);**/
}

.instructor_header .resume .total span.course i {
  color: grey;
  margin-right: 0.5em;
  margin-left: 0.5em;
  /**border: 0.1em solid rgb(0, 0, 255, 0.2);
  border-radius: 50%;
  padding: 0.4em 0.4em;
  
  background-color: rgb(0, 0, 255, 0.2);**/
}

.instructor_header .resume .total {
  margin: 1em 0;
}

.instructor_header .resume .total span {
  margin: 0.3em 0;
  font-size: 1.1em;
}

.instructor_header .resume .icon {
  margin: 1.5em 0;
}

.instructor_header .resume .icon i {
  font-size: 2rem;
}

.user-image {
  height: 12em;
  width: 12em;
  padding: 0.01em;
  border-radius: 50%;
}

.card-img-top {
  height: 16em;
}

.g-box-shadow {
  box-shadow: 0px 0px 9px 10px rgba(0, 0, 0, 0.1);
}

.g-accordion-item-header-title--practice {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
}

.g-section-item-tile-practice {}

@media only screen and (max-width: 37.5em) {
  .g-course-overview-header {
    padding: 0.1rem 0em;
  }

  .g-course-overview-header-title {
    font-size: 1.2em;
    margin: 0.2em 0;
  }

  .price_card {
    padding: 1rem 0em
  }
}

@media only screen and (max-width: 23.44em) {}
</style>
