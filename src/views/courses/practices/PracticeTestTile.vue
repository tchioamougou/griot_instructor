<template>
  <template v-if="isLoading"> <g-spinner /></template>
  <template v-else>
    <div id="fullscreen-div">
      <div class="pt_tile">
        <div class="pt_tile-item">
          <div class="pt_tile--header">
            <div class="title">
              {{ pt.practiceTest.title }}
              <span v-if="isFinished"> - Result</span>
            </div>
            <div class="details">
              {{ pt.practiceTest.totalQuestions }} questions |
              {{ pt.practiceTest.duration }} minutes |
              {{ pt.practiceTest.minimumScore }}% {{ $t('score_required_to_pass') }}
            </div>
          </div>
          <template v-if="!reviewQuestion">
            <div class="pt_tile--content" v-if="!isFinished">
              <div class="description">{{ pt.description }}</div>
              <div class="instruction">{{ $t('instructions') }}:</div>
              <ul class="instructionList">
                <li>{{ $t('pt_tile.l1') }}</li>
                <li>
                  {{ $t('pt_tile.l2') }}
                </li>
                <li>
                  {{ $t('pt_tile.l3') }}
                </li>
                <li>
                  {{ $t('pt_tile.l4') }}
                </li>
                <li>
                  {{ $t('pt_tile.l5') }}
                </li>
                <li>
                  {{ $t('pt_tile.l6') }}
                </li>
              </ul>
            </div>
            <div class="result" v-if="isFinished">
              <div class="chart">
                <g-am-charts :correct="practiceTestPlay.totalCorrects" :failed="practiceTestPlay.totalFailed"
                  :skip="0" />
              </div>
              <div class="details">
                <div class="title">
                  <span>{{ $t('attempt') }} 1:</span>
                  <span v-if="!passed" class="failed">
                    {{ $t('failed_score_ms', { score: pt.practiceTest.minimumScore }) }}</span>
                  <span v-if="passed" class="passed">
                    {{ $t('failed_score_ms', { score: pt.practiceTest.minimumScore }) }}
                  </span>
                </div>
                <div class="score">
                  <span class="value">{{ percentage }}%</span><span>{{ $t('Checkout') }}({{
                    practiceTestPlay.totalCorrects
                  }}/{{
                      totalQuestion
                    }})</span>
                </div>
                <div class="duration">{{ practiceTestPlay.timeRemaining }} minutes</div>
                <div class="time">{{ time }}</div>
                <div class="action" @click="review">
                  <button>{{ $t('rewiew_question') }}</button>
                </div>
              </div>
            </div>
          </template>
          <template v-if="reviewQuestion">
            <div class="back">
              <button @click="backR">
                <i class="bi bi-chevron-left"></i> {{ $t('return_to_review') }}
              </button>
            </div>
            <div class="review_all_question">
              <div class="attempt">
                <div class="title">{{ $t('attempt') }} 1</div>
                <div class="select">
                  <g-dropdown :options="filterOptions" label-class="medium" :disabled="isLoading" @selected="fil" />
                </div>
              </div>
              <template v-for="(question, index) in recordToShow" :key="index">
                <question-review-item :record="question" :index="index + 1" />
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="pt_tile-actions">
        <button class="skip" @click="skip" v-if="!isFinished">{{ $t('skip_test') }}</button>
        <button class="skip" @click="nextPractice" v-if="isFinished">
          {{ $t('continue_btn') }}
        </button>
        <button class="start" @click="retake" v-if="isFinished">
          {{ $t('retake_test') }}
        </button>
        <button class="start" @click="start" v-if="!isFinished">
          {{ $t('begin_test') }}
        </button>
        <button class="fullscreen gd-md" @click="fullscreen">
          <i class="bi bi-arrows-angle-expand" v-if="!isFull"></i>
          <i class="bi bi-arrows-angle-contract" v-if="isFull"></i>
        </button>
        <button class="expand gd-md" @click="expand">
          <i class="bi bi-arrows-angle-expand" v-if="!isExpand"></i>
          <i class="bi bi-arrows-angle-contract" v-if="isExpand"></i>
        </button>
      </div>
    </div>
  </template>
</template>
<script setup>
import { formatDateT } from "../../resources/UtilityFunction";
import { computed, defineAsyncComponent, ref, watch } from "vue";
const GSpinner = defineAsyncComponent(() =>
  import("../../resources/GSpinner.vue")
);
const GAmCharts = defineAsyncComponent(() => import("./GAmCharts.vue"));
const QuestionReviewItem = defineAsyncComponent(() =>
  import("./QuestionReviewItem.vue")
);
const GDropdown = defineAsyncComponent(() =>
  import("../../resources/GDropdown.vue")
);
const emits = defineEmits(["fullscreen", "expand", "next", "retake", "begin"]);
const props = defineProps({
  pt: {
    type: Object,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  learningCourseId: {
    type: String,
    required: true,
  },
});
const isLoading = ref(false);
const reviewQuestion = ref(false);
const filterValue = ref("AllQuestion");
const isExpand = ref(false);
const isFull = ref(false);
const filterOptions = ref([
  { label: "All questions", value: "AllQuestion" },
  { label: "Correct", value: "Correct" },
  { label: "Incorrect", value: "Incorrect" },
  { label: "Skipped", value: "Skipped" },
  { label: "Marked for review", value: "MarkedForReview" },
]);
const skip = () => {
  emits("next");
};
const retake = () => {
  emits("retake");
};
const review = () => {
  reviewQuestion.value = true;
};
const start = () => {
  emits('begin');
};
const fullscreen = () => {
  isFull.value = !isFull.value;
  let elem = document.getElementById("fullscreen-div");

  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  emits("fullscreen");
};
const expand = () => {
  isExpand.value = !isExpand.value;
  emits("expand", isExpand.value);
};
const nextPractice = () => {
  emits("next");
};
const backR = () => {
  reviewQuestion.value = false;
};
const fil = (value) => {
  filterValue.value = value;
};
const isFinished = computed(() => {
  console.log("pt", props.pt);
  return props.pt.status === "Finish";
});
const practiceTestPlay = computed(() => { return props.pt.practiceTestPlays ? props.pt.practiceTestPlays[props.pt.practiceTestPlays.length - 1] : {} });
const percentage = computed(() => {
  return Math.trunc(
    (practiceTestPlay.value.totalCorrects / totalQuestion.value) * 100
  );
});
const passed = computed(() => {
  return percentage.value >= props.pt.minimumScore;
});
const time = computed(() => {
  return formatDateT(practiceTestPlay.value.lastModifyDate);
});
const totalQuestion = computed(() => { return props.pt.practiceTest.totalQuestions });
const recordToShow = computed(() => {
  let questions = JSON.parse(practiceTestPlay.value.questionJson);
  if (filterValue.value == "Correct") {
    questions = questions.filter((e) => e.responseCorrect);
  } else if (filterValue.value === "Incorrect") {
    questions = questions.filter((e) => !e.responseCorrect && !e.skipped);
  } else if (filterValue.value === "Skipped") {
    questions = questions.filter((e) => e.skipped);
  } else if (filterValue.value === "MarkedForReview") {
    questions = questions.filter((e) => e.markAsReview);
  }
  return questions;
});
</script>
<style scoped>
.pt_tile {
  padding: 3em 1em;
  display: flex;
  justify-content: center;
  font-family: sans-serif;
  max-height: 70vh;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
}

.pt_tile-item {
  display: flex;
  flex-direction: column;
  width: 80%;
}

.pt_tile--header {
  padding: 1em 0;
  border-bottom: 0.001em solid rgb(128, 128, 128, 0.1);
}

.pt_tile--header .title {
  font-weight: 900;
  font-size: 2em;
  margin-bottom: 0.5em;
}

.pt_tile--header .details {
  font-size: 1.5em;
}

.pt_tile--content {
  padding: 2em 0;
}

.instructionList li {
  margin: 0.25em 0;
  font-size: 1em;
}

.instruction {
  margin: 0.25em 0;
}

.pt_tile-actions {
  display: flex;
  justify-content: right;
  border-bottom: 0.1em solid rgb(128, 128, 128, 0.3);
  border-top: 0.1em solid rgb(128, 128, 128, 0.3);
  padding: 0.5em 1em;
  font-family: sans-serif;
}

.pt_tile-actions button {
  margin: 0 0.25em;
  border: none;
  background-color: #ffffff;
}

button.skip {
  font-size: 0.9em;
  font-weight: 900;
}

button.start {
  font-size: 0.9em;
  font-weight: 700;
  background-color: black;
  color: white;
  padding: 0.5em 1em;
}

button.fullscreen {
  font-weight: 900;
  font-size: 1.5em;
}

button.expand {
  transform: rotate(45deg);
  font-weight: 900;
  font-size: 1.5em;
}

.description {
  margin-bottom: 1em;
}

.result {
  margin: 1em 0;
  padding: 1em 1em;
  position: relative;
  display: flex;
  flex-direction: row;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.75);
}

.result .details .title {
  font-family: sans-serif;
  font-size: 1.4em;
}

.score {
  margin: 0.5em 0;
}

.score .value {
  font-size: 1.8em;
  font-weight: 900;
  margin-right: 0.25em;
}

.duration {
  margin: 0.5em 0;
  font-size: 1.1em;
}

.time {
  margin: 0.5em 0;
}

.chart {
  width: 50%;
  margin-right: 0.7em;
}

.action {
  margin-top: 2em;
}

.action button {
  background-color: transparent;
  padding: 0.75em 1em;
  border: black solid 0.01em;
  font-weight: 700;
}

.action button:hover {
  background-color: rgb(128, 128, 128, 0.08);
}

.failed {
  color: red;
}

.passed {
  color: green;
}

.review_all_question {
  display: flex;
  flex-direction: column;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.75);
  padding: 1em 0;
}

.back {
  display: flex;
  flex-direction: row;
  justify-content: left;
  margin: 1.5em 0;
}

.back button {
  border: none;
  background-color: transparent;
  font-weight: 700;
  color: var(--g-color-item);
}

.attempt {
  display: flex;
  justify-content: space-between;
  padding: 1em 2em;
}

.attempt .title {
  font-size: 1.5em;
  color: rgb(0, 0, 0, 0.75);
}

.attempt .select {
  border: 0.1em solid rgb(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-self: center;
  justify-items: center;
  padding-top: 0.75em;
}

.select:hover {
  background-color: rgb(128, 128, 128, 0.08);
}

.g-dropdown .g-dropdown-label {
  padding: 0 !important;
  color: red !important;
}

@media only screen and (max-width: 37.5em) {
  .pt_tile {
    padding: 3em 0em;
  }
}

@media only screen and (max-width: 23.44em) {
  .pt_tile {
    padding: 3em 0em;
  }
}
</style>
