<template>
  <template v-if="localItem">
    <div class="curriculum_item">
      <div class="g-item" @mouseover="onHover" v-if="!editLecture" @mouseleave="onLeave">
        <div class="block_left">
          <i class="bi bi-check-circle-fill me-2" v-if="isCompleted"></i>
          <span><span v-if="!isCompleted"><i class="bi bi-exclamation-triangle-fill text-warning"></i>{{
            $t('unpublished') }}</span>
            {{ $t(item.type) }} {{ item.position }} : {{ item.title }}
          </span>
          <span :class="itClass">
            <span @click="startEditLecture" class="ms-2"><i class="bi bi-pencil-fill"></i></span>
            <span class="ms-2" @click="confirmDelete"><i class="bi bi-x-circle"></i></span>
          </span>
        </div>
        <div class="block_right" v-if="canAddContent">
          <span class="g-add-content-btn" v-if="isLecture" @click="initAddContent">
            <span v-if="item.documentType"> {{ $t('update_content') }} </span>
            <span v-else>{{ $t('add_content') }}</span></span>
          <!--<span class="g-add-content-btn" v-if="isQuiz" @click="initAddQuestion">
            <span>+ {{ $t('Questions') }}</span></span>-->
          <span>
            <i class="bi bi-chevron-down" v-if="!showDetails" @click="showDetails = true"></i>
            <i class="bi bi-chevron-up" v-else @click="showDetails = false"></i>
          </span>
        </div>
      </div>
      <div :class="showDetails || editLecture || addingContent || addingResources || addingQuestion
        ? 'curriculum_item_content'
        : ''
        ">
        <div class="lecture_edit" v-if="editLecture">
          <div class="lecture_edit_content">
            <span class="title">{{ $t(item.type) }} {{ item.position }} :
            </span>
            <div class="input">
              <g-input v-model="localItem.title" :max="80" show-rest :placeholder="$t('title_placeholder')"
                :is-error="hasError && localItem.title" :message-error="$t('field_blank_error')" />
            </div>
          </div>
          <div class="actions">
            <button @click="editLecture = false">{{ $t('cancel_btn') }}</button>
            <button class="save" :disabled="isSaving" @click="updateLectureLocal">
              <spinner-cmp v-if="isSaving" />
              {{ $t('save') }} {{ $t(item.type) }}
            </button>
          </div>
        </div>
        <div class="lecture_content" v-if="showDetails && !isQuiz">
          <div class="lecture_details" v-if="item.documentType">
            <div class="block_preview">
              <div class="image">
                <img src="../../assets/images/home/create-account.svg" height="100" width="100" />
              </div>
              <div class="details">
                <div class="title">{{ item.title }}</div>
                <div class="">{{ getFileSizeLocal(item.size) }}</div>
                <div class="time">{{ duration }}</div>
                <div class="edit">
                  <i class="bi bi-pencil-fill"></i> {{ $t('edit_content') }}
                </div>
              </div>
            </div>
            <div class="block_parameters">
              <div class="preview">
                <div class="form-check form-switch">
                  <label class="form-check-label" for="preview">{{ $t('FreePreview') }}</label>
                  <input class="form-check-input" type="checkbox" id="preview" v-model="localItem.preview"
                    :disabled="isSaving" @change="updateLectureLocal" />
                </div>
              </div>
              <div class="download">
                <div class="form-check form-switch">
                  <label class="form-check-label" for="download">{{ $t('Downloadable') }}</label>
                  <input class="form-check-input" type="checkbox" id="download" v-model="localItem.downloadable"
                    :disabled="isSaving" @change="updateLectureLocal" />
                </div>
              </div>
            </div>
          </div>
          <div class="lecture_description" v-if="typingDescription">
            <div class="text">
              <g-rich-text-editor :label="$t('lecture_description')" v-model="localItem.description"
                :content="item.description" />
            </div>
            <div class="actions">
              <button class="cancel" @click="cancel">{{ $t('cancel_btn') }}</button>
              <button class="save" :disabled="isSaving" @click="updateItemDescription">
                <spinner-cmp v-if="isSaving" />
                {{ $t('save') }}
              </button>
            </div>
          </div>
          <div class="block_materials" v-if="localItem.resources">
            <div class="title">{{ $t('downloadable_materials') }}</div>
            <div class="resourceList">
              <div class="resourceList_item" v-for="(re, i) in localItem.resources" :key="i">
                <div class="name">
                  <template v-if="re.type === 'DownloadableFile'">
                    <i class="bi bi-download"></i><span>{{ re.name }} {{ getFileSize(re.size) }}</span>
                  </template>
                  <template v-if="re.type === 'ExternalResource'">
                    <i class="bi bi-link"></i><span>{{ re.name }}</span>
                  </template>
                </div>
                <div class="action" @click="deleteResource(re.id)"><i class="bi bi-trash-fill"></i></div>
              </div>
            </div>
          </div>
          <div class="block_action">
            <button @click="typingDescription = true" v-if="!typingDescription">
              + {{ $t('Description') }}
            </button>
            <button @click="addNewResource">+ {{ $t('Resources') }}</button>
          </div>
        </div>
        <div class="lectures_addResource" v-if="addingResources">
          <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="pills-downloadable-tab" data-bs-toggle="pill"
                data-bs-target="#pills-downloadable" type="button" role="tab" aria-controls="pills-downloadable"
                aria-selected="true" @click="getResourceType('DownloadableFile')">
                {{ $t('DownloadableFile') }}
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-curriculum-tab" data-bs-toggle="pill"
                data-bs-target="#pills-curriculum" type="button" role="tab" aria-controls="pills-curriculum"
                aria-selected="false" @click="getResourceType('ExternalResource')">
                {{ $t('ExternalResource') }}
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-instructor-tab" data-bs-toggle="pill"
                data-bs-target="#pills-instructor" type="button" role="tab" aria-controls="pills-instructor"
                aria-selected="false" @click="getResourceType('SourceCode')">
                {{ $t('SourceCode') }}
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" @click="cancel">
                <i class="bi bi-x-lg"></i>
              </button>
            </li>
          </ul>
          <hr />
          <div class="tab-content" id="pills-tabContent">
            <div class="tab-pane fade show active" id="pills-downloadable" role="tabpanel"
              aria-labelledby="pills-downloadable-tab">
              <div class="g-resource-downloadable">
                <g-upload-files repository="Resources" :file-name="item.id" source="videoCourse"
                  :apiName="'downloadable' + item.id" :placeholder="$t('No file selected')"
                  :button-name="$t('Select File')" type="Document" @selected="getDownloadableFile" />
                <div class="actions">
                  <button @click="cancel">{{ $t('cancel_btn') }}</button>
                  <button class="save" :disabled="isSaving || !newResource.file" @click="saveNewResources">
                    <spinner-cmp v-if="isSaving" />
                    {{ $t('save') }}
                  </button>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="pills-curriculum" role="tabpanel" aria-labelledby="pills-curriculum-tab">
              <g-input :label="$t('title')" v-model="newResource.name"></g-input>
              <g-input label="URL" v-model="newResource.url"></g-input>
              <div class="link-button">
                <button class="g-button" :disabled="isSaving || !newResource.url || !newResource.name"
                  @click="saveNewResources">
                  <spinner-cmp v-if="isSaving" />
                  {{ $t('link') }}
                </button>
              </div>
            </div>
            <div class="tab-pane fade" id="pills-instructor" role="tabpanel" aria-labelledby="pills-instructor-tab">
              <div class="ms-3">
                <g-upload-files :placeholder="$t('No file selected')" :button-name="$t('Select File')" />
              </div>
            </div>
          </div>
        </div>
        <div class="lectureAddContent" v-if="addingContent">
          <div class="lectureAddContent_title">
            <span>{{ $t('addingContent_ob.description') }} <a href="#">{{ $t('addingContent_ob.description_url')
                }}</a></span>
          </div>
          <div class="lectureAddContent_type">
            <input type="radio" id="Video" value="Video" v-model="documentType" class=""
              :disabled="localItem.documentType != ''" />
            <label for="Video">{{ $t('Video') }}</label>
            <input type="radio" id="Article" value="Article" v-model="documentType" class=""
              :disabled="localItem.documentType != ''" />
            <label for="Article">{{ $t('Article') }}</label>
          </div>
          <div v-if="documentType == 'Video'" class="lectureAddContent_video">
            <div class="lectureAddContent_video_file">
              <g-upload-files repository="Videos_Course" :file-name="item.id" :course="course" source="videoCourse"
                :apiName="item.id" :placeholder="$t('No file selected')" :button-name="$t('select_Video')" type="Video"
                @selected="onGetVideoDetails" />
            </div>
            <div class="nb">
              <span>{{ $t('lecture_video_nb') }}</span>
            </div>
          </div>
          <div v-if="documentType == 'Article'" class="mt-4">
            <g-rich-text-editor v-model="localItem.article" :label="$t('Article')" :content="item.article" />
          </div>
          <div class="actions">
            <button @click="addingContent = false">{{ $t('cancel_btn') }}</button>
            <button class="save" :disabled="isSaving" @click="updateLectureContent">
              <spinner-cmp v-if="isSaving" />
              {{ $t('save') }}
            </button>
          </div>
        </div>
        <div class="" v-if="isQuiz">
          <div class="" v-if="showDetails">
            <template v-if="!addingQuestion">
              <div class="g_pt-content--question-type">
                <div class="g_pt-content--question-type-item" @click="selectType('Choice')">
                  <div class="icon"><i class="bi bi-question-circle"></i></div>
                  <div class="type">{{ $t('multiple_choice') }}</div>
                </div>
                <div class="g_pt-content--question-type-item" @click="selectType('Select')">
                  <div class="icon"><i class="bi bi-question-circle"></i></div>
                  <div class="type">{{ $t('muliple_select') }}</div>
                </div>
              </div>
              <div class="g_pt-content--question-list">
                <template v-for="(q, index) in item.quiz" :key="index">
                  <question-tile :question="q" :position="index + 1" @edit="editQuestion(index)"
                    @delete="confirmDeleteQuestion(index)" />
                </template>
              </div>
            </template>
            <template v-if="addingQuestion">
              <question-edit :question-type="questionType" :action="actionQuestion" :lecture-id="item.id"
                @save="saveQuestion" @cancel="closeEditQuestion" :question="currentEditQuestion"
                :course-id="courseId"></question-edit>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
  <g-toast ref="message" :duration="10000" direction="top-right" />
  <g-confirmation :id="'item_' + item.id" ref="confirmation" @accepted="accepted" :message="$t('confirm_delete_item')"
    @cancel="refuse" :title="$t('please_confirm')" />
  <g-confirmation :id="'questio_' + item.id" ref="confirmationQuestion" @accepted="acceptedQuestion"
    :message="$t('confirm_delete_question')" @cancel="refuse" :title="$t('please_confirm')" />
</template>
<script setup>
import GRichTextEditor from "../../resources/GRichTextEditor.vue";
import GToast from "../../resources/GToast.vue";
import SpinnerCmp from "../../resources/Spinner.vue";
import GConfirmation from "../../resources/GConfirmation.vue";
import { computed, onMounted, ref } from "vue";
import { AddResources, deleteLecture, deleteQuestion, deleteResources, getLecture, updateLecture } from "../../database/griot";
import { estimateReadingTime, formatTime, getFileSize } from "../../resources/UtilityFunction";
import { LECTURE_TYPE } from "@/resources/utilityConstant";
import router from "@/router";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emits = defineEmits(['refresh']);
const props = defineProps({
  item: {
    Object,
    required: true
  }
});
const message = ref(null);
const confirmation = ref(null);
const confirmationQuestion = ref(null);
const localItem = ref(null);
const isSaving = ref(false);
const typingDescription = ref(false);
const showDetails = ref(false);
const addingResources = ref(false);
const editLecture = ref(false);
const addingContent = ref(false);
const addingQuestion = ref(false);
const documentType = ref(null);
const hasError = ref(false);
const courseId = ref(null);
let newResource = ref({});
const questionType = ref("");
const actionQuestion = ref('');
const currentEditQuestion = ref(null);
const questionToDelete = ref(null);
const showQuiz = ref(false);
const addContent = () => {
}
const canAddContent = computed(() => {
  return props.item.type != LECTURE_TYPE.CodingExercise;
});
const isCodingExercise = computed(() => {
  return props.item.type === LECTURE_TYPE.CodingExercise;
});
const isQuiz = computed(() => {
  return props.item.type === LECTURE_TYPE.Quiz;
});
const isCompleted = computed(() => {
  console.log(props.item.type, LECTURE_TYPE.Lecture);
  if (props.item.type === LECTURE_TYPE.Lecture) {
    return props.item.documentType && (props.item.article || props.item.contentLink);
  } else if (isQuiz.value) {
    return props.item.quiz && props.item.quiz.length > 0;
  } else if (isCodingExercise) {
    return props.item.codingExercise;
  }
  return false;
})
const isLecture = computed(() => {
  return props.item.type === LECTURE_TYPE.Lecture;
});
const startEditLecture = () => {
  if (isCodingExercise.value) {
    router.push({ name: 'codingExercise', params: { courseId: courseId.value }, query: { lectureId: props.item.id } });
  } else {
    editLecture.value = true;
  }
}
const onGetVideoDetails = (value) => {
  localItem.value.contentLink = value.downloadURL;
  localItem.value.duration = value.duration;
  localItem.value.size = value.filesize;
};
const updateItemDescription = () => {
  if (localItem.value.description) {
    updateLectureLocal();
  }
}
const getParameters = () => {
  const navigationParams = router.currentRoute.value.params;
  if (navigationParams) {
    if (navigationParams.courseId && navigationParams.item) {
      courseId.value = navigationParams.courseId;
    }
  }
};
const updateLectureContent = () => {
  if (documentType.value) {
    localItem.value.documentType = documentType.value;
    if (documentType.value === 'Article') {
      localItem.value.duration = parseInt(estimateReadingTime(localItem.value.article));
    }
    updateLectureLocal();
  }
}
const confirmDeleteQuestion = (index) => {
  questionToDelete.value = questionsList.value[index];
  actionQuestion.value = "deleteQuestion";
  confirmationQuestion.value.show();
};
const saveQuestion = () => {
  emits("refresh");
  addingQuestion.value = false;
  currentEditQuestion.value = null;
};
const closeEditQuestion = () => {
  addingQuestion.value = false;
  currentEditQuestion.value = null;
};
const editQuestion = (index) => {
  currentEditQuestion.value = questionsList.value[index];
  addingQuestion.value = true;
  actionQuestion.value = "edit";
  questionType.value = currentEditQuestion.value.type;

};
const questionsList = computed(() => {
  return props.item.quiz;
});
const updateLectureLocal = () => {
  console.log("lecture", localItem.value);
  if (!localItem.value.title) {
    hasError.value = true;
    return;
  }
  isSaving.value = true;
  updateLecture(props.item.id, localItem.value).then((response) => {
    return response.json();
  }).then((result) => {
    cancel();
    message.value.toast(t('Lecture'), t('lecture_update_toast'), 'success');
  }).catch((error) => {
    message.value.toast(t('Lecture'), t('error_occur'), 'error');
  }).finally(() => {
    isSaving.value = false;
  })
}
const cancel = () => {
  typingDescription.value = false;
  showDetails.value = true;
  addingResources.value = false;
  editLecture.value = false;
  addingContent.value = false;
};
const addNewResource = () => {
  addingResources.value = true;
  showDetails.value = false;
};
const initAddContent = () => {
  addingContent.value = true;
  showDetails.value = false;
};
const initAddQuestion = () => {
  addingQuestion.value = true;
  showDetails.value = false;
}
onMounted(() => {
  localItem.value = props.item;
  documentType.value = props.item.documentType;
});
const duration = computed(() => {
  return formatTime(props.item.duration);
});
const getFileSizeLocal = (size) => {
  return getFileSize(size);
}
const refresh = () => {
  getLecture(props.item.id).then((response) => {
    return response.json();
  }).then((data) => {
    localItem.value = data;
  }).catch((error) => {
    console.log('This the error', error);
    message.value.toast(t('refresh_page'), t('error_occur'), 'error');
  })
}
/// those functions are used to manage resources information
const getResourceType = (type) => {
  newResource.value = {};
  newResource.value.type = type;
};
const getDownloadableFile = (value) => {
  newResource.value.file = value.downloadURL;
  newResource.value.size = value.filesize;
  newResource.value.name = value.fileName;
};
const saveNewResources = () => {
  isSaving.value = true;
  AddResources(props.item.id, [newResource.value]).then((response) => {
    return response.json();
  }).then(data => {
    console.log('saveNewResources', data);
    isSaving.value = false;
    cancel();
    message.value.toast(t('Resource'), t('resource_add_toast'), 'error');
    refresh();
  }).catch((error) => {
    console.log('saveNewResources=> error', error);
    message.value.toast(t('Resource'), t('error_occur'), 'error');
  }).finally(() => {
    isSaving.value = false;
  })
}
/** parameters information*/
let action = null;
let resourceId = null;
const confirmDelete = () => {
  action = "delete";
  confirmation.value.show();
};
const accepted = () => {
  confirmation.value.showSpinner();
  if (action === "delete") {
    deleteItem();
  } else if (action === 'deleteResource') {
    deleteResourceConfirm();
  }
  //confirmation.value.hide();
};
const acceptedQuestion = () => {
  confirmationQuestion.value.showSpinner();
  deleteQuestion(questionToDelete.value.id).then((response) => {
    confirmationQuestion.value.hide();
    emits('refresh');
    message.value.toast(t('Questions'), t('question_delete_toast'), 'success');
  }).catch((error) => {
    console.log('user information', error);
    message.value.toast(t('Questions'), t('error_occur'), 'error');
  }).finally(() => {
    confirmationQuestion.value.hideSpinner();
  });
};
const refuse = () => {
  confirmation.value?.hide();
  confirmationQuestion.value?.hide();
};
const deleteResource = (i) => {
  action = 'deleteResource';
  resourceId = i;
  confirmation.value.show();
};
const selectType = (type) => {
  questionType.value = type;
  actionQuestion.value = "new";
  addingQuestion.value = true;
};
const deleteResourceConfirm = () => {
  deleteResources(props.item.id, resourceId).then((response) => {
    console.log('deleteResources', response)
    if (response.status == 200) {
      refresh();
      confirmation.value.hideSpinner();
      confirmation.value.hide();
      message.value.toast(t('Resource'), t('resource_delete_toast'), 'success');
    }
  }).catch((error) => {
    confirmation.value.hideSpinner();
    message.value.toast(t('Resource'), t('error_occur'), 'error');
    console.log('error', error);
  })
}
const deleteItem = () => {
  deleteLecture(props.item.id).then((response) => {
    if (response.status == 200) {
      confirmation.value.hideSpinner();
      confirmation.value.hide();
      emits('refresh');
      message.value.toast(t('Lectures'), t('lecture_deleted_toast'), 'success');
    }
  }).catch((error) => {
    confirmation.value.hideSpinner();
    console.log('deleteItem==>error', error);
    message.value.toast(t('Lectures'), t('error_occur'), 'error');
  })
}
getParameters();
</script>
<script>
import GInput from "../../resources/GInput.vue";
import GSelect from "../../resources/GSelect.vue";
import GUploadFiles from "../../resources/GUploadFiles.vue";
import GTextArea from "../../resources/GTextArea.vue";
import QuestionEdit from "./QuestionEdit.vue";
import {
  LECON_ITEMS_TYPES,
} from "../../resources/utilityConstant";
import QuestionTile from './QuestionTile.vue';

export default {
  name: "GItem",
  components: { GTextArea, GUploadFiles, GSelect, GInput, QuestionTile },
  data: function () {
    return {
      itClass: "g-hide",
      options: LECON_ITEMS_TYPES,
    }
  },
  methods: {
    onHover() {
      this.itClass = "g-show";
    },
    onLeave() {
      this.itClass = "g-hide";
    },
    editItem() {
      this.editLecture = true;
      this.typingDescription = false;
      this.addingResources = false;
      this.showDetails = false;
      this.hasError = false;
    }
  }
};
</script>

<style scoped>
.curriculum_item {
  border: 0.01em solid gray;
  border-bottom: none;
  margin-bottom: 1em;
  background-color: white;
}

.lecture_content .lecture_details {
  display: flex;
  justify-content: space-between;
  font-family: sans-serif;
  border-bottom: 0.01em solid gray;
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
  border-bottom: 0.01em solid gray;
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
  border-bottom: 0.01em solid gray;
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
</style>
