<template>
  <template v-if="localItem">
    <div class="curriculum_item rounded-sm border-black/25 border">
      <div class="g-item" v-if="!editPracticeTest">
        <div class="block_left">
          <i class="bi bi-check-circle-fill me-2"></i>
          <!--@click="confirmDelete"-->
          <span>{{ t('createNewCourse_practiceTest') }} {{ position }} : {{ item.title }} </span>
          <span :class="itClass">
            <span @click="editItem" class="ms-2"><i class="bi bi-pencil-fill"></i></span>
            <span class="ms-2"><i class="bi bi-x-circle"></i></span>
          </span>
        </div>
        <div class="block_right">
          <spinner-cmp v-if="isLoading" color="text-black" />
          <div class="button" v-if="addingQuestion || batchAction">
            <span>{{ t('add_question') }}</span> <i class="bi bi-x-lg" @click="cancel"></i>
          </div>
          <span>
            <i class="bi bi-chevron-down" v-if="!showDetails" @click="getDetails"></i>
            <i class="bi bi-chevron-up" v-else @click="showDetails = false"></i>
          </span>
        </div>
      </div>
      <div class="edit_pt" v-if="editPracticeTest">
        <div class="cancel cursor-pointer text-red-400">
          <i class="bi bi-x-lg" @click="cancel"></i>
        </div>
        <div class="new_pt">
          <div class="new_pt_content">
            <div class="new_pt_content_label"><span>{{ t('createNewCourse_practiceTest') }} :</span></div>
            <div class="new_pt_content_input">
              <div class="new_pt_content_div">
                <g-input :max="80" show-rest v-model="localItem.title" :is-error="hasError"
                  :message-error="t('field_blank_error')" :label="t('title')" />
                <g-input v-model="localItem.description" :label="t('Description')" />
                <g-input v-model="localItem.duration" :is-error="hasError" :label="t('duration')" type="number" />
                <g-input v-model="localItem.minimumScore" :is-error="hasError" :label="t('minimun_percentage')"
                  type="number" />
              </div>
              <div class="new_pt_content_action">
                <div class="actions">
                  <button class="cancel" @click="cancel">{{ t('cancel_btn') }}</button>
                  <button class="save" @click="updatePracticeLocal" :disabled="canEdit">
                    <spinner-cmp v-if="isSaving" />{{ t("edit_Pratice_test") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="g_pt-content" v-if="showDetails">
        <template v-if="!addingQuestion && !batchAction">
          <div class="g_pt-content--question-type">
            <div class="g_pt-content--question-type-item cursor-pointer" @click="selectType('Choice')">
              <div class="icon"><i class="bi bi-question-circle"></i></div>
              <div class="type">{{ t('multiple_choice') }}</div>
            </div>
            <div class="g_pt-content--question-type-item cursor-pointer" @click="selectType('Select')">
              <div class="icon"><i class="bi bi-question-circle"></i></div>
              <div class="type">{{ t('muliple_select') }}</div>
            </div>
            <div class="g_pt-content--question-type-item cursor-pointer" @click="batchUpload">
              <div class="icon"><i class="bi bi-question-circle"></i></div>
              <div class="type">{{ t('batch_questio_upload') }}</div>
            </div>
          </div>
          <div class="g_pt-content--question-list">
            <template v-for="(q, index) in questionsList" :key="index">
              <question-tile :question="q" :position="index + 1" @edit="editQuestion(index)"
                @delete="confirmDeleteQuestion(index)" />
            </template>
          </div>
        </template>
        <template v-if="batchAction">
          <div class="batchBlock">
            <div class="title">{{ t('bulk_upload_title') }}</div>
            <div class="description">
              {{ t('bulk_upload_text_1') }}<a href="#">{{ t('bulk_upload_text_csv') }}</a>,<a href="#">{{
                t('bulk_upload_text_txt') }}</a>,<a href="#">{{ t('bulk_upload_text_json') }}</a>,
              {{ t('bulk_upload_text_2') }}
            </div>
            <div class="nb">
              {{ t('bulk_upload_nb') }}
            </div>
            <div class="upload">
              <g-input-file :file-name="t('No file selected')" :button-name="t('upload_file')"
                @upload-file="readCSVFile" allow=".csv,.txt,.json" api-name="fille_upload" />
            </div>
            <div>{{ t("number_record_to_import") }} {{ recordToImport.length }}</div>
            <div class="flex justify-end gap-2">
              <Button size="sm" variant="neutral" class="cancel" @click="cancelImport">{{ t('cancel_btn') }}</Button>
              <Button size="sm" :disabled="!canSave || isSaving" @click="importQuestion">
                <spinner-cmp v-if="isSaving" />{{ t('save') }}
              </Button>
            </div>
          </div>
        </template>
        <template v-if="addingQuestion">
          <question-edit :question-type="questionType" :action="action" :pt-id="item.id" @save="saveQuestion"
            @cancel="closeEditQuestion" :question="currentEditQuestion"></question-edit>
        </template>
      </div>
    </div>
  </template>
  <g-confirmation :id="'item_' + item.id" ref="confirmation" @accepted="accepted" :message="t('confirm_delete_item')"
    @cancel="refuse" :title="t('please_confirm')" :accept-label="t('yes')"/>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from "vue";
import {
  createQuestions,
  deletePractice,
  deleteQuestion,
  getPracticeTestById,
  updatePractice,
} from "@/services/griot_service";
import { useI18n } from "vue-i18n";
import Button from "@/components/ui/Button.vue";
import { useToast } from 'vue-toastification'
// Async components
const SpinnerCmp = defineAsyncComponent(() => import("@/components/spinner/Spinner.vue"));
const GConfirmation = defineAsyncComponent(() => import("@/components/ui/GConfirmation.vue"));
const QuestionEdit = defineAsyncComponent(() => import("@/views/courses/questions/QuestionEdit.vue"));
const QuestionTile = defineAsyncComponent(() => import("@/views/courses/questions/QuestionTile.vue"));
const GInput = defineAsyncComponent(() => import("@/components/forms/FormElements/BaseInput.vue"));
const GInputFile =  defineAsyncComponent(() => import("@/components/forms/FormElements/GInputFile.vue"));


const toast = useToast();
const { t } = useI18n();


const props = defineProps<{
  item: Record<string, any>;
  position: number;
}>();

const emits = defineEmits<{
  (e: "refresh"): void;
  (e: "delete", id: string): void;
}>();

// UI State
const itClass = ref("g-hide");
const localItem = ref<Record<string, any> | null>(null);
const isSaving = ref(false);
const editPracticeTest = ref(false);
const addingResources = ref(false);
const showDetails = ref(false);
const hasError = ref(false);
const action = ref<string>('');
const confirmation = ref<any>(null); // Replace with actual confirmation dialog instance type
const questionToDelete = ref<Record<string, any>>();
const questionType = ref<string>('');
const addingQuestion = ref(false);
const batchAction = ref(false);
const currentEditQuestion = ref<Record<string, any>>();
const isLoading = ref(false);
const recordToImport = ref<Record<string, any>[]>([]);

// Computed
const questionsList = computed(() => localItem.value?.questions ?? []);
const canEdit = computed(() => {
  return (
    isSaving.value ||
    !localItem.value?.title ||
    !localItem.value?.duration ||
    !localItem.value?.minimumScore
  );
});
const canSave = computed(() => recordToImport.value.length > 0);

// Core methods
const editItem = () => {
  editPracticeTest.value = true;
  addingResources.value = false;
  showDetails.value = false;
  hasError.value = false;
};

const updatePracticeLocal = () => {
  if (!localItem.value) return;
  isSaving.value = true;
  updatePractice(props.item.id, localItem.value)
    .then((response) => response.json())
    .then(() => {
      isSaving.value = false;
      toast.success(t("section_updated"));
      editPracticeTest.value = false;
    })
    .catch(() => {
      isSaving.value = false;
     toast.error(t("error_occur"));
    });
};

const deleteItemLocal = () => {
  deletePractice(props.item.id)
    .then((response) => {
      if (response.status === 200) emits("delete", props.item.id);
      confirmation.value.hideSpinner();
      confirmation.value.hide();
    })
    .catch(console.error);
};

const deleteQuestionLocal = () => {
  if (!questionToDelete.value) return;
  deleteQuestion(questionToDelete.value.id!)
    .then((response) => {
      if (response.status === 200 && localItem.value) {
        localItem.value.questions = localItem.value.questions.filter((q: any) => q.id !== questionToDelete.value?.id);
      }
      confirmation.value.hideSpinner();
      confirmation.value.hide();
    })
    .catch(console.error);
};

const accepted = () => {
  confirmation.value.showSpinner();
  if (action.value === "delete") deleteItemLocal();
  if (action.value === "deleteQuestion") deleteQuestionLocal();
};

const refuse = () => {
  questionToDelete.value = undefined;
  confirmation.value.hide();
};

const editQuestion = (index: number) => {
  currentEditQuestion.value = questionsList.value[index];
  questionType.value = currentEditQuestion.value?.type;
  addingQuestion.value = true;
  action.value = "edit";
};

const confirmDeleteQuestion = (index: number) => {
  questionToDelete.value = questionsList.value[index];
  action.value = "deleteQuestion";
  confirmation.value.show();
};

const closeEditQuestion = () => {
  addingQuestion.value = false;
  currentEditQuestion.value = undefined;
};

const selectType = (type: string) => {
  questionType.value = type;
  action.value = "new";
  addingQuestion.value = true;
};

const batchUpload = () => {
  batchAction.value = true;
};

const cancel = () => {
  showDetails.value = true;
  editPracticeTest.value = false;
  addingQuestion.value = false;
  batchAction.value = false;
};

const cancelImport = () => {
  addingQuestion.value = false;
  batchAction.value = false;
  recordToImport.value = [];
};

const saveQuestion = () => {
  getPracticeTestLocal();
  closeEditQuestion();
};

const getPracticeTestLocal = async () => {
  const result = await getPracticeTestById(props.item.id);
  if (result.jsonResponse && result.httpStatusCode === 200) {
    localItem.value = result.jsonResponse;
  } else {
    // handle error
  }
};

const importQuestion = () => {
  isSaving.value = true;
  createQuestions(recordToImport.value)
    .then((response) => response.json())
    .then(() => {
      toast.success(t("question_imported"));
      isSaving.value = false;
      getPracticeTestLocal();
      cancelImport();
    })
    .catch((error) => {
      toast.error(t("an_error_import_question"));
      console.error(error);
      isSaving.value = false;
    });
};

const getDetails = () => {
  showDetails.value = true;
  if ((!questionsList.value?.length && localItem.value?.totalQuestions > 0)) {
    getPracticeTestLocal();
  }
};

// File upload handling
const readCSVFile = (file: File) => {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = (event) => {
    try {
      const data = event.target?.result as string;
      if (file.type === "text/plain") buildQuestions(data);
      else if (file.type === "text/csv") buildQuestionFromCsv(data);
      else if (file.type === "application/json") buildQuestionsFromJson(data);
    } catch (e) {
      console.error("File parsing error", e);
    }
  };
};
const buildQuestionsFromJson = (jsonString: string) => {
  const mp = { 0: "a", 1: "b", 2: "c", 3: "d", 4: "e", 5: "f" }

  try {
    const fullQuestion = JSON.parse(jsonString);
    console.log('e', fullQuestion)
    const questions = fullQuestion.map((e: any, i: number) => {
      const ques: any = {
        explanation: e.explanation ?? " ",
        responses: e.response?.map((ans: any, index: number) => {
          return {
            content: ans.content,
            isCorrect: ans.isCorrect ? true : false
          }
        }),
        position: i + 1,
        content: e.content,
        description: "",
        practiceTestId: props.item.id,
      }
      const totaltrue = ques.responses?.filter((e: any) => e.isCorrect)?.length;
      if (totaltrue && totaltrue > 1) {
        ques.type = "select";
      } else { ques.type = "Choice" }
      return ques;
    });
    console.log('question', questions)
    recordToImport.value = questions;
  } catch (error) {
    console.log('error', error)
  };
}
// Question builders (keep as is — already typed inline)
const buildQuestions = (text: string) => {
  const questions = text.split(/\d+ of \d+/);
  const questionsJSON = [];
  for (let i = 0; i < questions.length; i++) {
    const questionTexte = questions[i].trim();
    if (!questionTexte) continue;
    // Diviser la question en sections (question, réponses, explication)
    const sections = questionTexte.split("Explanation:");
    // Extraire l'explication
    const explanation = sections[1] ? sections[1].trim() : "";
    // Extraire le texte de la question
    // Extraire le numéro de la question
    const questionNumberMatch = questionTexte.match(/(\d+ of \d+)/);
    const questionNumber = questionNumberMatch ? questionNumberMatch[0] : "";

    // Extraire le texte de la question
    const optionsText = sections[0].split(/(?=[A-E]\. )/).filter(Boolean);
    const options = [];
    const questionTextOnly = optionsText[0].trim();
    for (let j = 1; j < optionsText.length; j++) {
      let optionText = optionsText[j].trim();
      const isCorrect = optionText.includes("istrue");
      optionText = optionText.replace(/^[A-E]\./, "").trim();
      if (optionText) {
        const text = optionText.replace("istrue", "").trim();
        options.push({ content: text, isCorrect: isCorrect });
      }

    }

    const result: any = {
      type: "Choice",
      explanation: explanation,
      responses: options,
      content: questionTextOnly,
      description: "",
      practiceTestId: props.item.id,
    };
    const totaltrue = result.responses?.filter((e: any) => e.isCorrect)?.length;
    if (totaltrue && totaltrue > 1) {
      result.type = "select";
    }
    if (result.responses.length > 0) {
      questionsJSON.push(result);
    }

  }
  console.log("text", questionsJSON);
  recordToImport.value = questionsJSON;
};
const buildQuestionFromCsv = (csvdata: string) => {
  const rowData = csvdata.split("\n");
  const questions = [];
  // Loop on the row Array (change row=0 if you also want to read 1st row)
  for (let row = 1; row < rowData.length; row++) {

    const question: any = {};
    // Split by comma (,) to get column Array
    const rowColData = rowData[row].split(",");
    question.content = rowColData[0];
    question.type =
      rowColData[1] === "multi-select"
        ? "Select"
        : rowColData[1] == "multiple-choice"
          ? "Choice"
          : "";
    let answers: any = rowColData.slice(2, 12).map((e) => {
      return {
        content: e,
        isCorrect: false,
      };
    });

    answers = answers.filter((e: any) => e.content);
    const correctList = rowColData[12].split(";");
    for (let i = 0; i < answers.length; i++) {
      answers[i].position = i + 1;
      if (correctList.includes("" + answers[i].position)) {
        answers[i].isCorrect = true;
      }
    }
    question.description = rowColData[14];
    question.explanation = rowColData[13];
    question.responses = answers;
    question.practiceTestId = props.item.id;
    questions.push(question);
  }
  console.log("all questions", questions);
  recordToImport.value = questions;
}
watch(
  () => props.item,
  (newVal) => {
    localItem.value = newVal;
  }
);

localItem.value = props.item;
</script>

<style scoped>
.curriculum_item {
  border-bottom: none;
  margin-bottom: 1em;
  background-color: white;
}

.lecture_content .lecture_details {
  display: flex;
  justify-content: space-between;
  font-family: sans-serif;
  margin: 0.5em;
}

.lecture_content .lecture_details .block_preview {
  display: flex;
  flex-direction: row;
}

.lecture_content .lecture_details .block_preview .details {
  flex-direction: column;
  display: flex;
}

.lecture_content .lecture_details .block_preview .details .title {
  font-weight: 900;
}

.lecture_content .lecture_details .block_preview .details .time {
  font-weight: 400;
  margin: 0.3rem 0;
}

.lecture_content .lecture_details .block_preview .details .edit {
  color: blue !important;
  font-weight: 900;
  cursor: pointer;
}

.lecture_content .lecture_details .block_parameters {
  display: flex;
  flex-direction: column;
  padding: 0.5em;
}

.lecture_content {}

.lecture_content .block_materials {
  font-family: sans-serif;
  margin: 0.5em;
}

.lecture_content .block_materials .title {
  font-weight: 700;
}

.lecture_content .block_materials .resourceList {
  margin: 0.5em 0;
  font-size: small;
}

.lecture_content .block_materials .resourceList .resourceList_item {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin: 0.5em 0;
}

.resourceList_item .name i {
  margin-right: 0.8em;
}

.resourceList_item .action i {
  margin-right: 0.8em;
  cursor: pointer;
}

.lecture_content .block_action {
  font-family: sans-serif;
  margin: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: left;
}

.lecture_content .block_action button {
  padding: 0.5em 1em;
  width: 200px;
  margin-bottom: 1em;
  font-weight: 800;
  font-size: 0.9em;
  background-color: white;
}

.lecture_content .block_action button:hover {
  background-color: rgb(128, 128, 128, 0.1);
}

.lecture_content .lecture_description {
  font-family: sans-serif;
  margin: 0.5em;
}

.lecture_content .lecture_description .actions {
  display: flex;
  justify-content: right;
  margin: 0.5em 0;
}

.lecture_content .lecture_description .actions button {
  border: none;
  outline: none;
  padding: 0.5em 1em;
  background-color: white;
  font-size: 0.9em;
  font-family: sans-serif;
}

.lecture_content .lecture_description .actions button.save {
  background-color: var(--g-c-blue-dark);
  color: white;
  margin-left: 0.5em;
}

.g-hide {
  display: none;
}

.g-show {
  display: inline;
}

.g-item {
  width: 100%;
  cursor: pointer;
  padding: 1em 1em;
  border-bottom: 0.01em solid gray;
  display: flex;
  justify-content: space-between;
}

.g-add-content-btn {
  border: 1px var(--vt-c-black) solid;
  padding: 3px;
  cursor: pointer;
  padding: 0.9em 1em;
  margin-right: 1em;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 0.8em;
}

.g-add-content-btn:hover {
  background-color: var(--g-c-blue-dark);
  color: white;
}

.block_left {
  font-family: sans-serif;
}

.nav-link {
  margin: 0 1em;
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

.lectures_addResource {
  margin-top: 1em;
}

.link-button {
  display: flex;
  flex-direction: row;
  justify-content: left;
  margin-bottom: 1em;
  margin-left: 1em;
}

.link-button button {
  text-transform: capitalize;
  padding: 0.5em 1em;
}

.lecture_edit {
  padding: 0.5em 1em;
  font-family: sans-serif;
}

.lecture_edit .lecture_edit_content {
  display: flex;
  flex-direction: row;
}

.lecture_edit .title {
  font-family: sans-serif;
  font-weight: 900;
  width: 15%;
  padding: 1.5em 0;
  font-size: 0.9em;
}

.lecture_edit .input {
  width: 100%;
}

.lecture_edit .lecture_edit_content input {
  width: 100%;
  padding: 0.25em 1em;
}

.lecture_edit .actions,
.lectureAddContent .actions {
  display: flex;
  flex-direction: row;
  justify-content: right;
  margin: 0.25em 0;
}

.lecture_edit .actions button,
.lectureAddContent .actions button {
  border: none;
  outline: none;
  padding: 0.5em 1em;
  background-color: white;
  font-size: 0.9em;
  font-family: sans-serif;
}

.lecture_edit .actions button.save,
.lectureAddContent .actions button.save {
  background-color: var(--g-c-blue-dark);
  color: white;
  margin-left: 0.5em;
}

.lectureAddContent {
  padding: 1em 1em;
}

.lectureAddContent_title {
  font-family: sans-serif;
  font-size: 0.95em;
}

.nb {
  font-size: small;
}

.lectureAddContent {}

.lectureAddContent_title {}

.lectureAddContent_type {
  display: flex;
  flex-direction: row;
  margin: 1em 0;
}

.lectureAddContent_type input {
  margin-left: 1em;
  margin-right: 0.5em;
}

.lectureAddContent_video {
  display: flex;
  flex-direction: column;
}

.lectureAddContent_video .lectureAddContent_video_file {
  width: 100%;
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

.curriculum_item_content {
  border-bottom: 0.01em solid gray;
}

.g-resource-downloadable {
  padding: 0.5em 1em;
}

.edit_pt {}

.new_pt {
  border: none;
  border-bottom: 0.01em black solid;
}

.cancel {
  margin-top: 0.5em;
  margin-left: 01em;
  cursor: pointer;
}

.g_pt-content--question-type {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1em 0;
}

.g_pt-content--question-type-item {
  border: 0.01em solid rgb(128, 128, 128, 0.2);
  padding: 0.5rem 1em;
  margin: 0 1em;
  cursor: pointer;
  background-color: #f5f7f9;
  display: flex;
  flex-direction: column;
  justify-self: center;
  justify-content: center;
  justify-items: center;
  font-family: sans-serif;
}

.g_pt-content--question-type-item:hover {
  background-color: var(--g-c-blue-dark);
  color: white;
}

.g_pt-content--question-type-item .icon {
  display: flex;
  justify-content: center;
  font-size: 1.7em;
}

.g_pt-content--question-type-item .icon i {
  -webkit-transition: 0.6s ease-out;
  -moz-transition: 0.6s ease-out;
  transition: 0.6s ease-out;
}

.g_pt-content--question-type-item:hover i {
  -webkit-transform: rotateZ(720deg);
  -moz-transform: rotateZ(720deg);
  transform: rotateZ(720deg);
}

.g_pt-content--question-type-item .type {
  display: flex;
  justify-content: center;
  font-size: 0.8em;
}

.g_pt-content {
  border-bottom: 0.01em black solid;
}

.batchBlock {
  padding: 1em;
  font-family: sans-serif;
}

.batchBlock .title {
  font-weight: 900;
  margin: 0.5em 0;
}

.batchBlock .description {
  font-size: 0.9em;
}

.batchBlock .nb {
  font-weight: 900;
  margin: 0.5em 0;
}

.block_right {
  display: flex;
  justify-content: space-between;
}

.button {
  margin-bottom: -1.2em;
  display: flex;
  justify-self: center;
  background-color: #f5f7f9;
  justify-content: space-between;
  border: solid 1px gray;
  border-bottom: none;
  padding: 0.5em 0.5em;
  font-size: 0.9em;
  margin-right: 0.3em;
}
</style>
