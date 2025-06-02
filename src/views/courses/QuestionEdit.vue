<template>
  <div class="g_question_edit">
    <g-rich-text-editor label="Question" api-name="Question" :justify-content="false" v-model="questionContent"
      :content="questionContent" />
    <div class="answer_title">{{ $t('Answer') }}</div>
    <template v-for="(answer, index) in answers" :key="index">
      <div class="answer_item">
        <input :type="type" name="answer" @change="getCorrect(index)" v-if="type === 'radio'"
          :checked="answer.isCorrect" />
        <input :type="type" name="answer" v-model="answer.isCorrect" v-if="type === 'checkbox'" />
        <div class="answer_value">
          <g-rich-text-editor :api-name="'Id_' + answer.position" :justify-content="false"
            :show-header-when-editing="true" :data-placeholder="$t('Add new answer')" @focused="addAnswer(index)"
            v-model="answer.content" :content="answer.content" />
        </div>
        <div class="answer_action">
          <i class="bi bi-trash-fill" @click="remove(index)"></i>
        </div>
      </div>
    </template>
    <div class="nb">
      {{ $t('answer_limit', { limit: ANSWER_LIMIT }) }}
    </div>
    <div class="answer_explanation">
      <g-rich-text-editor :label="$t('Explanation')" api-name="explanation" :justify-content="false"
        :description="$t('expline_with')" v-model="questionExplanation" :content="questionExplanation" />
    </div>
    <div class="answer_explanation">
      <g-rich-text-editor :label="$t('Description')" api-name="description" :justify-content="false"
        :description="$t('Description')" v-model="questionDescription" :content="questionDescription" />
    </div>
    <div class="actions">
      <button @click="cancel">{{ $t('cancel_btn') }}</button>
      <button class="save" :disabled="isSaving || !verifyQuestion" @click="save">
        <spinner-cmp v-if="isSaving" /> {{ $t('save') }}
      </button>
    </div>
  </div>
  <g-toast ref="message" :duration="10000" direction="top-right" />
</template>
<script setup>
import { ANSWER_LIMIT } from "../../resources/utilityConstant";
import { computed, ref } from "vue";
import { AddQuestions, createQuestions, updateQuestion } from "../../database/griot";
import GRichTextEditor from "../../resources/GRichTextEditor.vue";
import SpinnerCmp from "../../resources/Spinner.vue";
import GToast from "../../resources/GToast.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const emits = defineEmits(["save", 'cancel']);
const props = defineProps({
  questionType: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  question: {
    type: Object,
  },
  ptId: {
    type: String,
    required: false,
  },
  lectureId: {
    type: String,
    required: false
  },
  courseId: {
    type: String,
    required: false
  }
});
const questionContent = ref(null);
const questionExplanation = ref(null);
const questionDescription = ref(null);
const message = ref();
const answers = ref([
  { content: "", isCorrect: false },
  { content: "", isCorrect: false },
  { content: "", isCorrect: false },
]);
const initAnswer = ref([
  { content: "", isCorrect: false },
  { content: "", isCorrect: false },
  { content: "", isCorrect: false },
]);
const isSaving = ref(false);
const type = computed(() => {
  return props.questionType == "Choice" ? "radio" : "checkbox";
});
const cancel = () => {
  emits('cancel');
};
const verifyQuestion = computed(() => {
  console.log("question data", answers.value);
  if (!questionContent.value) {
    return false;
  } else {
    let notValid = true;
    for (let i = 0; i < answers.value.length - 2; i++) {
      if (!answers.value[i].content) {
        notValid = false;
        break;
      }
    }
    if (!notValid) {
      return notValid;
    } else {
      const ans = answers.value.filter((a) => a.isCorrect);
      if (props.questionType === "Choice") {
        if (!ans || ans.length !== 1) {
          return false;
        }
      } else if (props.questionType === "Select") {
        if (!ans || ans.length < 2) {
          return false;
        }
      }
    }
    return true;
  }
});
const remove = (index) => {
  if (answers.value.length > 1) {
    answers.value.splice(index, 1);
  }
};
const addAnswer = (index) => {
  console.log("index", index);
  if (
    answers.value.length - 1 === index &&
    answers.value.length <= ANSWER_LIMIT
  ) {
    answers.value.push({ content: "", position: index + 1, isCorrect: false });
    console.log("this.answers", answers.value);
  }
};
const reset = () => {
  questionExplanation.value = null;
  questionContent.value = null;
  answers.value = initAnswer.value;
};
const getCorrect = (index) => {
  answers.value = answers.value.map((e) => {
    return { ...e, isCorrect: false };
  });
  answers.value[index].isCorrect = true;
};
const save = () => {
  isSaving.value = true;
  let __answers = answers.value.filter((e) => e.content);
  for (let i = 0; i < __answers.length - 1; i++) {
    __answers[i].position = i + 1;
  }
  if (props.action === "new") {
    let questionObject = {
      type: props.questionType,
      explanation: questionExplanation.value ?? "",
      responses: __answers,
      content: questionContent.value,
      description: questionDescription.value ?? "",
      practiceTestId: props.ptId ?? ""
    };
    var servicecall = props.lectureId ? AddQuestions(props.lectureId, props.courseId, [questionObject]) : createQuestions([questionObject]);
    servicecall.then((response) => {
      return response.json();
    })
      .then((data) => {
        message.value.toast(t("Question"), t("new_question_added"), "success");
        emits('save');
      })
      .catch((error) => {
        message.value.toast(t("Question"), t("error_occur"), "error");
      }).finally(() => {
        isSaving.value = false;
      });
  } else if (props.action === "edit") {
    let questionObject = {
      ...props.question,
      explanation: questionExplanation.value,
      responses: __answers,
      content: questionContent.value,
      description: questionDescription.value,
    };
    updateQuestion(props.question.id, questionObject)
      .then((response) => {
        console.log("Response", response);
        return response.json();
      })
      .then((data) => {
        message.value.toast(t("Question"), t("question_updated"), "success");
        emits('save');
      })
      .catch((error) => {
        message.value.toast(t("Question"), t("error_occur"), "error");
        console.error(error);
      }).finally(() => {
        isSaving.value = false;
      })
  }
};
const init = () => {
  questionContent.value = props.question.content;
  questionExplanation.value = props.question.explanation;
  questionDescription.value = props.question.description;
  answers.value = props.question.responses ?? [];
}
if (props.action === 'edit') {
  init();
}
</script>
<style scoped>
.g_question_edit {
  padding: 0.5em 1em;
}

.answer_title {
  margin: 0.5em 0;
  font-weight: 900;
  font-size: 0.9em;
}

.answer_item {
  display: flex;
  flex-direction: row;
  margin: 0.5em 0;
}

.answer_item .answer_value {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 0.5em;
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
  border-color: blue;
}

input[type="checkbox"]:checked:focus {}

input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 1;
}

.nb {
  color: gray;
  font-size: 0.8em;
}

.answer_action {
  visibility: hidden;
  margin-left: 0.5em;
  cursor: pointer;
}

.answer_item:hover .answer_action {
  visibility: visible;
}

.answer_explanation {
  margin: 0.5em 0;
}
</style>
