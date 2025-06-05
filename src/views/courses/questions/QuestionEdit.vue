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
    <div class="flex justify-end gap-3">
      <Button variant="neutral" size="sm" @click="cancel">{{ $t('cancel_btn') }}</Button>
      <Button class="save" size="sm" :disabled="isSaving || !verifyQuestion" @click="save">
        <spinner-cmp v-if="isSaving" /> {{ $t('save') }}
      </Button>
    </div>
  </div>
  <g-toast ref="message" :duration="10000" direction="top-right" />
</template>
<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { ANSWER_LIMIT } from "@/utilities/utilityConstant";
import { AddQuestions, createQuestions, updateQuestion } from "@/services/griot_service";
import GRichTextEditor from "@/components/forms/FormElements/GRichTextEditor.vue";
import { useToast } from 'vue-toastification'
import Button from "@/components/ui/Button.vue";

const toast = useToast();
// i18n
const { t } = useI18n();

// Emits
const emit = defineEmits<{
  (e: 'save'): void;
  (e: 'cancel'): void;
}>();

// Props
const props = defineProps<{
  questionType: string; //'Choice' | 'Select'
  action: string; //'new' | 'edit'
  question?: Record<string,any>;
  ptId?: string;
  lectureId?: string;
  courseId?: string;
}>();

// State
const questionContent = ref<string >('');
const questionExplanation = ref<string >('');
const questionDescription = ref<string >('');

const answers = ref<Record<string,any>[]>([
  { content: "", isCorrect: false },
  { content: "", isCorrect: false },
  { content: "", isCorrect: false },
]);

const initAnswer = ref<Record<string,any>[]>([
  { content: "", isCorrect: false },
  { content: "", isCorrect: false },
  { content: "", isCorrect: false },
]);

const isSaving = ref(false);

const type = computed<'radio' | 'checkbox'>(() => {
  return props.questionType === "Choice" ? "radio" : "checkbox";
});

// Methods
const cancel = (): void => {
  emit("cancel");
};

const verifyQuestion = computed<boolean>(() => {
  if (!questionContent.value) return false;

  for (let i = 0; i < answers.value.length - 2; i++) {
    if (!answers.value[i].content) return false;
  }

  const correctAnswers = answers.value.filter((a) => a.isCorrect);
  if (props.questionType === "Choice" && correctAnswers.length !== 1) {
    return false;
  }
  if (props.questionType === "Select" && correctAnswers.length < 2) {
    return false;
  }

  return true;
});

const remove = (index: number): void => {
  if (answers.value.length > 1) {
    answers.value.splice(index, 1);
  }
};

const addAnswer = (index: number): void => {
  if (answers.value.length - 1 === index && answers.value.length <= ANSWER_LIMIT) {
    answers.value.push({ content: "", position: index + 1, isCorrect: false });
  }
};

const reset = (): void => {
  questionExplanation.value = '';
  questionContent.value = '';
  answers.value = [...initAnswer.value];
};

const getCorrect = (index: number): void => {
  answers.value = answers.value.map((e, i) => ({
    ...e,
    isCorrect: i === index,
  }));
};

const save = async (): Promise<void> => {
  isSaving.value = true;
  const validAnswers = answers.value.filter((e) => e.content);

  validAnswers.forEach((answer, i) => {
    answer.position = i + 1;
  });

  const questionPayload: Record<string,any> = {
    type: props.questionType,
    explanation: questionExplanation.value ?? "",
    responses: validAnswers,
    content: questionContent.value ?? "",
    description: questionDescription.value ?? "",
    practiceTestId: props.ptId ?? "",
  };

  try {
    if (props.action === "new") {
      const serviceCall = props.lectureId
        ? AddQuestions(props.lectureId, props.courseId!, [questionPayload])
        : createQuestions([questionPayload]);

      const response = await serviceCall;
      console.log("response", response);
      await response.json();

     toast.success( t("new_question_added"));
      emit("save");
    } else if (props.action === "edit" && props.question) {
      const updatedQuestion: Record<string,any> = {
        ...props.question,
        content: questionContent.value ?? "",
        explanation: questionExplanation.value ?? "",
        description: questionDescription.value ?? "",
        responses: validAnswers,
      };

      const response = await updateQuestion(props.question.id!, updatedQuestion);
      await response.json();

      toast.success(t("question_updated"));
      emit("save");
    }
  } catch (error) {
    toast.error( t("error_occur") );
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};

const init = (): void => {
  if (props.question) {
    questionContent.value = props.question.content;
    questionExplanation.value = props.question.explanation ?? null;
    questionDescription.value = props.question.description ?? null;
    answers.value = props.question.responses ?? [];
  }
};

if (props.action === "edit") {
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
