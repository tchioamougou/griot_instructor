<template>
    <template v-if="isLoading"><g-spinner /></template>
    <template v-if="lectureProgression && !isSaving && !displayResult">
        <div class="g_question_play">
            <div class="g_question_play--header">
                <span>{{ lectureProgression.lecture.title }} - Multiple Choice</span>
            </div>
            <template v-if="loadingQuestion"><spinner-cmp color="text-black" /></template>
            <template v-else>
                <div class="g_question_play--question">
                    <div class="g_question_play--question-number">
                        <span>{{ questionNumber }} of {{ totalQuestion }}</span>
                    </div>
                    <div class="g_question_play--question-details">
                        <div class="question" v-html="currentQuestion.content"></div>
                        <template v-for="(ans, index) in currentQuestion.responses" :key="index">
                            <div class="answer">
                                <input type="radio" name="answer_input" :id="'In' + index" @change="getCorrect(index)"
                                    v-if="currentQuestion.type === 'Choice'" :checked="ans.choice" />
                                <input type="checkbox" name="answer_input" :id="'In' + index" v-model="ans.choice"
                                    v-if="currentQuestion.type.toLowerCase() === 'select'" />
                                <label class="answer_value" :for="'In' + index" v-html="ans.content"></label>
                            </div>
                        </template>
                        <div class="error" v-if="hasError">{{ $t(messageError??'') }}</div>
                    </div>
                </div>
            </template>

            <div class="g_question_play--action">
                <button :disabled="loadingQuestion || questionNumber < 2" @click="previous">
                    {{$t("previous_btn")}}
                </button>
                <button :disabled="loadingQuestion || finished || questionNumber === totalQuestion
                    " @click="next">
                    {{$t('next')}}
                </button>
                <button :disabled="loadingQuestion" @click="submitTest" v-if="isFinished">{{$t('submit')}}</button>
            </div>
        </div>
    </template>
    <template v-if="displayResult">
         <div class="g_question_play">
            <div class="g_question_play--header">
                <span>{{ lectureProgression.lecture.title }} - Multiple Choice</span>
            </div>
            <div><span>{{ $t('correct') }} :{{ correctQuestion }}</span>  <span>{{$t('failed')}} :{{ failedQuestion }}</span></div>
            <template v-if="loadingQuestion"><spinner-cmp color="text-black" /></template>
            <template v-else>
                <div class="g_question_play--question" v-for="(qs,i) in answeredQuestions" :key="i">
                    <div class="g_question_play--question-number">
                        <span>{{ i+1 }} of {{ totalQuestion }}</span>
                    </div>
                    <div class="g_question_play--question-details" >
                        <div class="question" v-html="qs.content"></div>
                        <template v-for="(ans, index) in qs.responses" :key="index">
                            <div class="answer">
                                <input type="radio" :name="qs.id+'answer_inpu'+index" :id="qs.id+'res' + index" disabled
                                    v-if="qs.type === 'Choice'" :checked="ans.isCorrect" />
                                <input type="checkbox" :name="qs.id+'answer_inpu'+index" :id="'res' + index" v-model="ans.isCorrect"
                                    v-if="qs.type.toLowerCase() === 'select'" disabled />
                                <label :class="'answer_value '+(ans.isCorrect?'text-success':(ans.choice?'text-danger':''))" :for="'res' + index" v-html="ans.content"></label>
                            </div>
                        </template>
                        <div class="g_question_play--question-explanation mt-4">
                        {{ qs.explanation }}
                    </div>
                    </div>
                    
                </div>
            </template>

            <div class="g_question_play--action">
                <button @click="retake" title="retake this quiz">{{$t('retake')}}</button>
                <button @click="nextLecture" title="Go to next lecture">{{$t('next_lecture')}}</button>
            </div>
        </div>
    </template>
    <template v-if="isSaving"><g-spinner /></template>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getLecture, updateProgression } from "@/services/griot_service";
import GSpinner from "@/components/spinner/Spinner.vue";
import GRichTextEditor from "@/components/forms/FormElements/GRichTextEditor.vue";
import SpinnerCmp from "@/components/spinner/Spinner.vue";
import GConfirmation from '@/components/ui/GConfirmation.vue';
import { useAuthStore } from '@/composables/user';



const props = defineProps<{
  lectureProgression: Record<string, any>;
}>();

const emits = defineEmits<["finished", "next"]>();

const currentQuestion = ref<Record<string, any>>({} as Record<string, any>);
const questionNumber = ref(0);
const totalQuestion = ref(0);
const questions = ref<Record<string, any>[]>([]);
const remainMinutes = ref(0);
const remaining = ref<number | null>(null);
const answeredQuestions = ref<Record<string, any>[]>([]);
const hasError = ref(false);
const loadingQuestion = ref(false);
const messageError = ref<string | undefined>();
const finished = ref(false);
const confirmation = ref();
const submit = ref();
const correctQuestion = ref(0);
const failedQuestion = ref(0);
const isLoading = ref(false);
const practiceTestPlay = ref(null);
const isSaving = ref(false);
const displayResult = ref(false);
const currentQuestionAnswered = ref<Record<string, any>>({} as Record<string, any>);
const questionNumberAnswered = ref(0);

const progress = computed(() => {
  return (questionNumber.value / totalQuestion.value) * 100;
});

const user = computed(() => JSON.parse(useAuthStore().getUser));

const getCorrect = (index: number) => {
  const answers = currentQuestion.value.responses.map((e:any) => ({ ...e, choice: false }));
  answers[index].choice = true;
  currentQuestion.value.responses = [...answers];
};

const next = () => {
  if (!checkResponse()) {
    hasError.value = true;
  } else {
    hasError.value = false;
    loadingQuestion.value = true;
    validateUserResponse();

    if (questionNumber.value < answeredQuestions.value.length) {
      questionNumber.value++;
      currentQuestion.value = answeredQuestions.value[questionNumber.value - 1];
      loadingQuestion.value = false;
    } else {
      answeredQuestions.value.push(currentQuestion.value);
      getNextQuestion();
    }
  }
};

const checkResponse = (): boolean => {
  const userChoice = currentQuestion.value.responses.filter((e:any) => e.choice);
  if (currentQuestion.value.type === "Choice") {
    messageError.value = "quiz_error_choice";
    return userChoice.length === 1;
  } else if (currentQuestion.value.type.toLowerCase() === "select") {
    messageError.value = "quiz_error_select";
    return userChoice.length >= 2;
  }
  return true;
};

const validateUserResponse = () => {
  const answers = currentQuestion.value.responses;
  const choice = answers.reduce((correct:any, ans:any) => {
    if (!correct) return false;
    if (!ans.isCorrect && ans.choice) return false;
    if (ans.isCorrect && !ans.choice) return false;
    return true;
  }, true);
  currentQuestion.value.responseCorrect = choice;
};

const isFinished = computed(() => {
  return answeredQuestions.value.length >= (questions.value.length - 1);
});

const getNextQuestion = () => {
  currentQuestion.value = questions.value[questionNumber.value];
  questionNumber.value++;
  loadingQuestion.value = false;
};

const previous = () => {
  const fil = answeredQuestions.value.filter(e => e.id === currentQuestion.value.id);
  if (!fil.length) {
    answeredQuestions.value.push(currentQuestion.value);
  }
  questionNumber.value--;
  currentQuestion.value = answeredQuestions.value[questionNumber.value - 1];
  finished.value = false;
};

const submitTest = () => {
  if (!checkResponse()) {
    hasError.value = true;
  } else {
    hasError.value = false;
    validateUserResponse();

    if (questionNumber.value >= answeredQuestions.value.length) {
      answeredQuestions.value.push(currentQuestion.value);
    }
    finishedTest();
  }
};

const finishedTest = () => {
  answeredQuestions.value.forEach((question) => {
    if (question.responseCorrect) {
      correctQuestion.value++;
    } else if (question.skipped) {
      // skip logic (not defined)
    } else {
      failedQuestion.value++;
    }
  });

  const completed = () => {
    displayResult.value = true;
    currentQuestionAnswered.value = answeredQuestions.value[0];
    questionNumberAnswered.value = 1;
  };

  if (correctQuestion.value === questions.value.length) {
    if (props.lectureProgression.status !== 'Finish') {
      isSaving.value = true;
      const request = {
        percentage: 100,
        lectureId: props.lectureProgression.id,
      };
      updateProgression(user.value.id, request)
        .then((res) => res.json())
        .then(() => {})
        .catch((err) => console.error(err))
        .finally(() => {
          isSaving.value = false;
          completed();
        });
    } else {
      completed();
    }
  } else {
    completed();
  }
};

const retake = () => {
  init();
  displayResult.value = false;
  answeredQuestions.value = [];
  currentQuestion.value = questions.value[0];
  questionNumber.value = 1;
};

const nextLecture = () => {
  emits('next', true);
};

const init = () => {
  questionNumber.value = 1;
  getLecture(props.lectureProgression.lecture.id)
    .then((response) => response.json())
    .then((result) => {
      questions.value = result.quiz;
      currentQuestion.value = result.quiz[0];
      totalQuestion.value = result.quiz.length;
    })
    .catch((error) => {
      console.error("error", error);
    });
};

watch(() => props.lectureProgression, () => {
  init();
});
</script>


<style scoped>
.g_question_play {
    font-family: sans-serif;
    padding: 2em 4em;
    max-height: 70vh;
     overflow-y: scroll;
  overflow-x: hidden;
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

.g_question_play--feedback {}

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

input[type="checkbox"]:checked:focus {}

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

input[type="checkbox"]:checked:focus {}

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
<style scoped></style>