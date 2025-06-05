<template>
  <template v-if="isLoading"><g-spinner /></template>
  <template v-if="pt && !isSaving">
    <div class="g_question_play">
      <div class="g_question_play--logo"></div>
      <div class="g_question_play--header">
        <span>{{ pt.practiceTest.title }} - Multiple Choice</span>
      </div>
      <div class="g_question_play--timer">
        <span> {{$t('time_remaning')}} : {{ remaining }}</span>
        <div class="progress">
          <div
            class="progress-bar"
            role="progressbar"
            :style="'width:' + progress + '%'"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <button class="paused" @click="pauseTest">
          <i class="bi bi-pause-fill"></i>
        </button>
      </div>
      <template v-if="loadingQuestion"
        ><spinner-cmp color="text-black"
      /></template>
      <template v-else>
        <div class="g_question_play--question">
          <div class="g_question_play--question-number">
            <span>{{ questionNumber }} {{ $t('of') }} {{ totalQuestion }}</span>
          </div>
          <div class="g_question_play--question-details">
            <div class="question" v-html="currentQuestion.content"></div>
            <template v-for="(ans, index) in currentQuestion.responses" :key="index">
              <div class="answer">
                <input
                  type="radio"
                  name="answer_input"
                  :id="'In' + index"
                  @change="getCorrect(index)"
                  v-if="currentQuestion.type === 'Choice'"
                  :checked="ans.choice"
                />
                <input
                  type="checkbox"
                  name="answer_input"
                  :id="'In' + index"
                  v-model="ans.choice"
                  v-if="currentQuestion.type.toLowerCase() === 'select'"
                />
                <label
                  class="answer_value"
                  :for="'In' + index"
                  v-html="ans.content"
                ></label>
              </div>
            </template>
            <div class="error" v-if="hasError">{{ $t(messageError) }}</div>
          </div>
        </div>
        <div class="g_mark_for_review">
          <input
            type="checkbox"
            name="answer_input"
            id="markForReview"
            v-model="currentQuestion.markAsReview"
          />
          <label class="label_value" for="markForReview">
            {{$t('mark_later')}}
          </label>
        </div>
        <div class="g_question_play--feedback">
          <g-rich-text-editor
            label="Provide question feedback here (optional):"
            data-placeholder="Please provide feedback here ..."
            :justify-content="false"
            :show-header-when-editing="true"
          />
        </div>
      </template>

      <div class="g_question_play--action">
        <button
          :disabled="loadingQuestion || questionNumber < 2"
          @click="previous"
        >
          {{$t('previous_btn')}}
        </button>
        <button
          :disabled="
            loadingQuestion || finished || questionNumber === totalQuestion
          "
          @click="next"
        >
          {{$t('next')}}
        </button>
        <button :disabled="loadingQuestion" @click="submitTest">Submit</button>
      </div>
    </div>
  </template>
  <template v-if="isSaving"><g-spinner /></template>
  <g-toast ref="message" :duration="10000" direction="top-right" />
  <g-confirmation
    ref="confirmation"
    @accepted="resumeTest"
    @cancel="resumeTest"
    :message="$t('resume_test_msg')"
    :title="$t('resume_test_title')"
    :show-cancel="false"
    :accept-label="$t('resume_test_label')"
    id="confirmation"
  />
  <g-confirmation
    ref="submit"
    id="submit"
    @cancel="closeModal"
    :title="$t('submit_test_title')"
    :message="$t('submit_test_msg',{percentage:(100 - (questionNumber / totalQuestion) * 100)})"
    :accept-label="$t('submit_test_label')"
    @accepted="finishedTest"
  />
</template>
<script setup>
import {computed, onDeactivated, ref} from "vue";
import { timerFormat } from "../../resources/UtilityFunction";
import { getPracticeTestById, upsertPlay } from "@/services/griot_service";
import GSpinner from "../../resources/GSpinner.vue";
import GRichTextEditor from "../../resources/GRichTextEditor.vue";
import SpinnerCmp from "../../resources/Spinner.vue";
import GConfirmation from "../../resources/GConfirmation.vue";
import GToast from "../../resources/GToast.vue";
import store from "../../store";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const message = ref(null);
const props = defineProps({
  pt: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(['finished'])
const currentQuestion = ref({});
const questionNumber = ref(0);
const totalQuestion = ref(0);
const interval = ref(null);
const remainMinutes = ref(0);
const remaining = ref(null);
const answeredQuestions = ref([]);
const hasError = ref(false);
const loadingQuestion = ref(false);
const messageError = ref(null);
const finished = ref(false);
const confirmation = ref(null);
const submit = ref(null);
const isLoading =ref(false);
const practiceTestPlay = ref(null);
const isSaving = ref(false);
const progress = computed(() => {
  return (questionNumber.value / totalQuestion.value) * 100;
});
/** this function is used to save user progression*
 */
const getCorrect = (index) => {
  const answers = currentQuestion.value.responses.map((e) => {
    return { ...e, choice: false };
  });
  answers[index].choice = true;
  currentQuestion.value.responses = [...answers];
};
/** navigate to next question*/
const next = () => {
  if (!checkResponse()) {
    hasError.value = true;
  } else {
    hasError.value = false;
    loadingQuestion.value = true;
    validateUserResponse();
    if (questionNumber.value < answeredQuestions.value.length) {
      //console.log("Answer Area==>", answeredQuestions.value);
      questionNumber.value++;
      //console.log("Answer questionNumber==>", questionNumber.value);
      currentQuestion.value = answeredQuestions.value[questionNumber.value - 1];
      loadingQuestion.value = false;
    } else {
      answeredQuestions.value.push(currentQuestion.value);
      //console.log("Answer Area newt==>", answeredQuestions.value);
      getNextQuestion();
    }
  }
};
/**check if user select the right element*/
const checkResponse = () => {
  const userChoice = currentQuestion.value.responses.filter((e) => e.choice);
  if (currentQuestion.value.type === "Choice") {
    messageError.value = "Must select 1 element ";
    return userChoice && userChoice.length === 1;
  } else if (currentQuestion.value.type.toLowerCase() === "select") {
    messageError.value = "You must select at least 2 elements ";
    return userChoice && userChoice.length >= 2;
  }
  return true;
};
const validateUserResponse = () => {
  let answers = currentQuestion.value.responses;
  const choice = answers.reduce((correct, ans) => {
    if (correct) {
      if (!ans.isCorrect && ans.choice) {
        return false;
      } else if (ans.isCorrect && !ans.choice) {
        return false;
      } else {
        return correct;
      }
    } else {
      return false;
    }
  }, true);
  currentQuestion.value.responseCorrect = choice;
  currentQuestion.value.skipped = false;
};
const getNextQuestion = () => {
  currentQuestion.value = props.pt.practiceTest.questions[questionNumber.value];
  questionNumber.value++;
  loadingQuestion.value = false;
};
const previous = () => {
  const fil = answeredQuestions.value.filter(
    (e) => e.id === currentQuestion.value.id
  );
  if (!fil || fil.length <= 0) {
    answeredQuestions.value.push(currentQuestion.value);
  }
  questionNumber.value = questionNumber.value - 1;
  currentQuestion.value = answeredQuestions.value[questionNumber.value - 1];
  finished.value = false;
};
const resumeTest = () => {
  confirmation.value.hide();
  interval.value = setInterval(() => {
    remainMinutes.value--;
    remaining.value = timerFormat(remainMinutes.value);
  }, 1000);
};
const pauseTest = () => {
  clearInterval(interval.value);
  saveProgression();
  confirmation.value.show();
};
const saveProgression = () => {
  const fil = answeredQuestions.value.filter(
    (e) => e.id === currentQuestion.value.id
  );
  if (!fil || fil.length <= 0) {
    answeredQuestions.value.push(currentQuestion.value);
  }
  let resume = {
    practiceTestProgressionId: props.pt.id,
    questionJson: JSON.stringify(answeredQuestions.value),
    totalCorrects: 0,
    totalFailed: 0,
    passed: false,
    totalQuestions: totalQuestion.value,
    timeRemaining: remainMinutes.value,
    status: "Paused",
    totalQuestionsAnswered: answeredQuestions.value.length,
    totalQuestionsRemaining:
      totalQuestion.value - answeredQuestions.value.length,
  };
  if (practiceTestPlay.value && practiceTestPlay.value.id) {
    resume.id = practiceTestPlay.value.id;
  }
  upsertPlay(resume)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      practiceTestPlay.value = result;
    })
    .catch((error) => {
      console.log("upsertPlay===>response", error);
    });
};
const submitTest = () => {
  if (questionNumber.value < totalQuestion.value) {
    submit.value.show();
  } else {
    if (!checkResponse()) {
      hasError.value = true;
    } else {
      hasError.value = false;
      validateUserResponse();
      if (questionNumber.value < answeredQuestions.value.length) {
      } else {
        answeredQuestions.value.push(currentQuestion.value);
      }
      finishedTest();
    }
  }
};
const finishedTest = () => {
  isSaving.value = true;
  let correctQuestion = 0;
  let failedQuestion = 0;
  let skipQuestion = 0;
  answeredQuestions.value.forEach((question) => {
    if (question.responseCorrect) {
      correctQuestion++;
    } else if (question.skipped) {
      skipQuestion++;
    } else {
      failedQuestion++;
    }
  });
  let resume = {
    practiceTestProgressionId: props.pt.id,
    questionJson: JSON.stringify(answeredQuestions.value),
    totalCorrects: correctQuestion,
    totalFailed: failedQuestion,
    passed: false,
    totalQuestions: totalQuestion.value,
    timeRemaining: remainMinutes.value,
    status: "finished",
    totalQuestionsAnswered: answeredQuestions.value.length,
    totalQuestionsRemaining:
      totalQuestion.value - answeredQuestions.value.length,
  };
  if (practiceTestPlay.value && practiceTestPlay.value.id) {
    resume.id = practiceTestPlay.value.id;
  }
  console.log(resume);
  upsertPlay(resume)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        practiceTestPlay.value = result;
        isSaving.value = false;
        submit.value.hide();
        emits('finished');
      })
      .catch((error) => {
        isSaving.value = false;
        console.log("upsertPlay===>error", error);
      });
};
const closeModal =()=>{
  submit.value.hide();
}
const init = async () => {
  const result = await getPracticeTestById(props.pt.practiceTest.id);
      if (result.jsonResponse && result.httpStatusCode==200) {
        props.pt.practiceTest = result.jsonResponse
      }else{
        message.value.toast(t("practice_test"), t("error_occur"), "error");
      }
      
  questionNumber.value = 1;
  totalQuestion.value = props.pt.practiceTest.questions.length;
  remainMinutes.value = props.pt.practiceTest.duration * 60;
  practiceTestPlay.value = props.pt.practiceTestPlays && props.pt.practiceTestPlays.length > 0 && props.pt.practiceTestPlays[props.pt.practiceTestPlays.length-1].status !=="finished"?props.pt.practiceTestPlays[props.pt.practiceTestPlays.length-1]:{};
  if(practiceTestPlay.value.id){
    answeredQuestions.value = JSON.parse(practiceTestPlay.value.questionJson);
    remainMinutes.value = practiceTestPlay.value.timeRemaining;
    currentQuestion.value =answeredQuestions.value[answeredQuestions.value.length-1];
  }else {
    currentQuestion.value = props.pt.practiceTest.questions[0];
  }
  interval.value = setInterval(() => {
    remainMinutes.value--;
    remaining.value = timerFormat(remainMinutes.value);
  }, 1000);
};
// setup
store.dispatch("hideHeader");
init();
onDeactivated(()=>{
  store.dispatch("showHeader");
})
</script>

<style scoped>
.g_question_play {
  font-family: sans-serif;
  padding: 2em 4em;
}
.g_question_play--header {
  display: flex;
  justify-content: center;
  justify-items: center;
  justify-self: center;
  font-weight: 900;
  margin: 1em 0;
  font-size: 1.1em;
}
.g_question_play--timer {
  display: flex;
  font-weight: 700;
  margin: 1em 0;
  font-size: 1.2em;
}
.g_question_play--question {
  display: flex;
  flex-direction: row;
  padding: 0 1em;
  margin: 3em 0;
}
.g_question_play--question-number {
  margin-right: 2em;
  font-weight: 700;
}
.g_question_play--question-details .question {
  margin-bottom: 1em;
}
.g_question_play--question-details .answer {
  display: flex;
  flex-direction: row;
}
.g_question_play--question-details .answer .answer_value {
  margin-left: 1em;
}
.g_question_play--question-details .error {
  color: red;
  margin: 1em 0;
}
.g_question_play--feedback {
}

input[type="radio"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 2px solid #0a0809;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  outline: none;
  position: relative;
  transition: border-color 0.3s ease-in-out;
}
input[type="radio"]:checked:before {
  content: "";
  width: 10px;
  height: 10px;
  background-color: black;
  position: absolute;
  color: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  font-size: 5px;
  line-height: 5px;
  text-align: center;
}

input[type="checkbox"]:checked:focus {
}

input[type="radio"]:disabled {
  cursor: not-allowed;
}

input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 1px solid #0a0809;
  border-radius: 0px;
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
  padding-bottom: 0px;
  display: block;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
}

input[type="checkbox"]:focus {
  border-color: black;
}

input[type="checkbox"]:checked:focus {
}

input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 1;
}
.g_question_play--action {
  display: flex;
  margin: 1.5em 0;
}
.g_question_play--action button {
  margin-right: 1em;
  border: none;
  background-color: gray;
  padding: 0.51em 1em;
}
.g_question_play--action button:hover {
  background-color: black;
  color: white;
}
.progress {
  width: 50%;
  margin-top: 0.5em;
  margin-left: 1em;
  border-radius: 0;
}
.paused {
  border: none;
  margin-left: 0.2em;
  background-color: transparent;
  font-weight: 900;
}
.g_mark_for_review {
  margin: 1em 0;
}
.g_mark_for_review .label_value {
  margin-left: 0.5em;
  font-weight: 700;
}
</style>
