<template>
  <admin-layout>
    <div class="g-review-performance">
      <div class="header">
        <div class="header_title">
          <div class="title">{{ $t('Reviews') }}</div>
          <div class="input">
            <g-dropdown :options="reviewOptions" label-class="large" :disabled="isLoading" @selected="findReview" />
          </div>
        </div>
        <div class="header_filter_action">
          <div class="header_filter_action_input">
            <div class="me-5">
              <input type="checkbox" id="NotAnswered" v-model="hasReply" />
              <label for="NotAnswered">{{ $t('Not answered') }}</label>
            </div>
            <div class="me-5">
              <input type="checkbox" id="comment" v-model="hasComment" />
              <label for="comment">{{ $t("Has a comment") }}</label>
            </div>
            <div class="me-5">
              {{ $t("Rating") }} :
              <g-dropdown :options="ratingOptions" v-model="ratingFilter" @selected="selectRatingFilter" />
            </div>
            <div class="me-5">
              {{ $t('Sort by') }}:
              <g-dropdown :options="sortOptions" v-model="sortBy" @selected="SelectSortBy" />
            </div>
            <div class="me-5"></div>
          </div>
          <div class="header_filter_action_icon">
            <Button class="message">{{ $t('Export CSV') }}</button>
          </div>
        </div>
      </div>
      <div class="content">
        <template v-if="isLoading">
          <g-spinner />
        </template>
        <template v-for="(rev, index) in reviews" :key="index">
          <g-review-item :review-object="rev" />
        </template>
      </div>
    </div>
  </admin-layout>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, ref, watch } from 'vue';

import AdminLayout from '@/components/layout/AdminLayout.vue';
import { getInstructorCourses, getReviews } from '@/services/griot_service';
import { useAuthStore } from '@/composables/user';

import GDropdown from '@/components/ui/GDropdown.vue';
import GSpinner from '@/components/spinner/Spinner.vue';
import GReviewItem from './GReviewItem.vue';

import { getFirstAndLastChars, getTimeAgo } from '@/utilities/UtilityFunction';
import Button from '@/components/ui/Button.vue';

// i18n
const { t } = useI18n();

// Auth
const authStore = useAuthStore();
const user = computed(() => {
  const userData = authStore.user;
  return JSON.parse(userData);
});

// Review data and filters
const reviews = ref([]);
const reviewOptions = ref([{ label: t('overview.allCourses'), value: 'AllCourse' }]);
const ratingOptions = [
  { label: t("All"), value: "all" },
  { label: t("1 star"), value: "1" },
  { label: t("2 star"), value: "2" },
  { label: t("3 star"), value: "3" },
  { label: t("4 star"), value: "4" },
  { label: t("5 star"), value: "5" },
];
const sortOptions = [
  { label: t("Newest first"), value: "NewestFirst" },
  { label: t("Oldest first"), value: "OldestFirst" },
];

const isLoading = ref(false);
const allCourseId = ref([]);
const pageNumber = ref(1);
const pageSize = ref(10);
const hasComment = ref(false);
const hasReply = ref(false);
const ratingFilter = ref<any>(0);
const sortBy = ref<any>(null);
const request = ref<any>(null);

// Get instructor courses
const getInstructorCoursesLocal = () => {
  isLoading.value = true;
  getInstructorCourses(user.value.id)
    .then((response) => response.json())
    .then((result) => {
      reviewOptions.value = reviewOptions.value.concat(
        result.map((e: any) => ({
          label: e.title,
          value: e.id
        }))
      );
      allCourseId.value = result.map((e: any) => e.id);
      request.value = allCourseId.value;
      getReviewsLocal(allCourseId.value);
      isLoading.value = false;
    })
    .catch(() => {
      isLoading.value = false;
    });
};

// Fetch reviews
const getReviewsLocal = (request: any) => {
  isLoading.value = true;
  getReviews(
    request,
    hasComment.value,
    hasReply.value,
    sortBy.value,
    ratingFilter.value === "all" ? 0 : ratingFilter.value,
    pageNumber.value,
    pageSize.value
  )
    .then((response) => response.json())
    .then((result) => {
      reviews.value = result.records;
      isLoading.value = false;
    })
    .catch((error) => {
      isLoading.value = false;
      console.error("Error fetching reviews", error);
    });
};

// Interaction methods
const SelectSortBy = (value: any) => {
  sortBy.value = value;
  getReviewsLocal(request.value);
};

const selectRatingFilter = (value: any) => {
  ratingFilter.value = value !== "all" ? value : 0;
  getReviewsLocal(request.value);
};

const findReview = (val: any) => {
  if (val === "AllCourse") {
    getReviewsLocal(allCourseId.value);
    request.value = allCourseId.value;
  } else {
    request.value = [val];
    getReviewsLocal([val]);
  }
};

// Utilities
const avatarText = computed(() => getFirstAndLastChars("Griot User"));
const duration = computed(() => getTimeAgo(1686178800));
const getDate = (seconds: any) => getTimeAgo(seconds);

// Watchers
watch(() => hasReply.value, () => getReviewsLocal(request.value));
watch(() => hasComment.value, () => getReviewsLocal(request.value));

// Lifecycle
getInstructorCoursesLocal();
</script>


<style scoped>
.header {}

.header_title {
  display: flex;
  flex-direction: row;
}

.header_title .title {
  font-weight: 900;
  font-family: sans-serif;
  font-size: 1.6em;
  margin-right: 1em;
}

.header_filter_action {
  margin: 0.1em 0;
  display: flex;
  justify-content: space-between;
}

.header_filter_action_input {
  display: flex;
  flex-direction: row;
  margin-top: 1em;
}

.header_filter_action_icon button {
  padding: 0.5em 1em;
}

label {
  margin-left: 0.5em;
}

input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 2px solid #0a0809;
  border-radius: 0px;
  width: 14px;
  height: 14px;
  outline: none;
  position: relative;
  transition: border-color 0.3s ease-in-out;
}

input[type="checkbox"]:checked:before {
  content: "\2713";
  width: 14px;
  height: 14px;
  background-color: black;
  position: absolute;
  color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-bottom: 0px;
  display: block;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
}

input[type="checkbox"]:checked:focus {}

input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 1;
}
</style>
