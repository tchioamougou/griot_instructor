<template>
  <template v-if="localItem">
    <div class="border-1  px-0 py-1 rounded border-black/25 mb-10 g-item-container">
      <div class="g-item" @mouseover="onHover" v-if="!editLecture" @mouseleave="onLeave">
        <div class="block_left text-md">
          <i class="bi bi-check-circle-fill me-2" v-if="isCompleted"></i>
          <span><span v-if="!isCompleted"><i class="bi bi-exclamation-triangle-fill text-warning"></i>{{
            $t('unpublished') }}</span>
            {{ $t(item.type) }} {{ item.position }} : {{ item.title }}
          </span>
          <span>
            <span @click="startEditLecture" class="ms-2"><i class="bi bi-pencil-fill"></i></span>
            <span class="ms-2" @click="confirmDelete"><i class="bi bi-x-circle"></i></span>
          </span>
        </div>
        <div class="block_right"
          v-if="canAddContent && !addingContent && !editLecture && !addingResources && !addingQuestion && !typingDescription">
          <Button variant="primary" size="sm" v-if="isLecture" @click="initAddContent">
            <span v-if="item.documentType"> {{ $t('update_content') }} </span>
            <span v-else>{{ $t('add_content') }}</span>
          </Button>
          <Button size="sm" v-if="isQuiz" @click="initAddQuestion">
            <span>+ {{ $t('Questions') }}</span>
          </Button>
          <span class="ms-4">
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
          <div class="flex justify-between text-sm">
            <span class="title flex flex-col justify-start">{{ $t(item.type) }} {{ item.position }} :
            </span>
            <div class="input">
              <BaseInput v-model="localItem.title" :max="80" show-rest :placeholder="$t('title_placeholder')"
                :is-error="hasError && localItem.title" :message-error="$t('field_blank_error')" />
            </div>
          </div>
          <div class="actions">
            <Button variant="neutral" size="sm" @click="editLecture = false">{{ $t('cancel_btn') }}</button>
            <Button class="save" size="sm" :disabled="isSaving" @click="updateLectureLocal">
              <Spinner v-if="isSaving" />
              {{ $t('save') }} {{ $t(item.type) }}
            </button>
          </div>
        </div>
        <div class="lecture_content" v-if="showDetails && !isQuiz">
          <div class="lecture_details border-t-1 border-black/25 py-3" v-if="item.documentType">
            <div class="block_preview">
              <div class="image">
                <img src="@/assets/images/home/create-account.svg" height="100" width="100" />
              </div>
              <div class="details">
                <div class="title text-sm">{{ item.title }}</div>
                <div class="">{{ getFileSizeLocal(item.size) }}</div>
                <div class="time">{{ duration }}</div>
                <div class="edit">
                  <i class="bi bi-pencil-fill text-sm"></i> {{ $t('edit_content') }}
                </div>
              </div>
            </div>
            <div class="block_parameters gap-2">
              <div class="preview">
                <label class="inline-flex items-center cursor-pointer">
                  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 me-2">{{ $t('FreePreview')
                    }}</span>
                  <input type="checkbox" value="" class="sr-only peer" v-model="localItem.preview" id="preview"
                    :disabled="isSaving" @change="updateLectureLocal">
                  <div
                    class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600">
                  </div>
                </label>
              </div>
              <div class="download">
                <label class="inline-flex items-center cursor-pointer">
                  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 me-2">{{ $t('Downloadable')
                  }}</span>
                  <input type="checkbox" value="" class="sr-only peer" id="download" v-model="localItem.downloadable"
                    :disabled="isSaving" @change="updateLectureLocal">
                  <div
                    class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600">
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="block_materials border-t-1 py-2 border-b-1  border-black/25 " v-if="localItem.resources">
            <div class="title text-sm">{{ $t('downloadable_materials') }}</div>
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
            <Button @click="handelTypingDescription" v-if="!typingDescription" variant="neutral" size="sm">
              + {{ $t('Description') }}
            </Button>
            <Button @click="addNewResource" variant="neutral" size="sm">+ {{ $t('Resources') }}</Button>
          </div>
        </div>
        <div class="lecture_description border-t-1 py-3 px-3 border-black/25" v-if="typingDescription">
          <div class="text">
            <g-rich-text-editor :label="$t('lecture_description')" v-model="localItem.description"
              :content="item.description" />
          </div>
          <div class="flex justify-end gap-3">
            <Button variant="neutral" size="sm" @click="cancel">{{ $t('cancel_btn') }}</button>
            <Button class="save" size="sm" :disabled="isSaving" @click="updateItemDescription">
              <spinner-cmp v-if="isSaving" />
              {{ $t('save') }}
            </button>
          </div>
        </div>
        <!-- adding resources-->
        <div class="lectures_addResource px-3 border-1 py-3" v-if="addingResources">
          <!-- Tab Navigation -->
          <ul class="flex gap-2 mb-4 border-b border-gray-300">
            <li>
              <button :class="tabClass('DownloadableFile')" @click="selectTab('DownloadableFile')">
                {{ $t('DownloadableFile') }}
              </button>
            </li>
            <li>
              <button :class="tabClass('ExternalResource')" @click="selectTab('ExternalResource')">
                {{ $t('ExternalResource') }}
              </button>
            </li>
            <li>
              <button :class="tabClass('SourceCode')" @click="selectTab('SourceCode')">
                {{ $t('SourceCode') }}
              </button>
            </li>
          </ul>

          <!-- Tabs Content -->
          <div class="mt-4">
            <div v-show="activeTab === 'DownloadableFile'" class="space-y-4">
              <g-upload-files repository="Resources" :file-name="item.id" source="videoCourse"
                :apiName="'downloadable' + item.id" :placeholder="$t('No file selected')" allow-file="*"
                v-model="newResource.file" :button-name="$t('Select File')" type="Document"
                @selected="getDownloadableFile" />
              <div class="flex gap-4 justify-end">
                <Button size="sm" variant="neutral" class="px-4 py-2 bg-gray-200 rounded" @click="cancel">
                  {{ $t('cancel_btn') }}
                </Button>
                <Button size="sm" :disabled="isSaving || !newResource.file" @click="saveNewResources">
                  <Spinner v-if="isSaving" />
                  {{ $t('save') }}
                </Button>
              </div>
            </div>

            <div v-show="activeTab === 'ExternalResource'" class="space-y-4">
              <BaseInput :label="$t('title')" v-model="newResource.name" />
              <BaseInput label="URL" v-model="newResource.url" />
              <div class="flex justify-end gap-4">
                <Button size="sm" variant="neutral" class="px-4 py-2 bg-gray-200 rounded" @click="cancel">
                  {{ $t('cancel_btn') }}
                </Button>
                <Button size="sm" class="g-button px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  :disabled="isSaving || !newResource.url || !newResource.name" @click="saveNewResources">
                  <spinner-cmp v-if="isSaving" />
                  {{ $t('link') }}
                </Button>
              </div>
            </div>

            <div v-show="activeTab === 'SourceCode'" class="ml-4">
              <g-upload-files :apiName="'downloadable' + item.id" repository="Resources"
                :placeholder="$t('No file selected')" :button-name="$t('Select File')" v-model="newResource.file"
                allow-file="*" type="Document" source="videoCourse" @selected="getDownloadableFile" />
              <div class="flex justify-end gap-4">
                <Button size="sm" variant="neutral" class="px-4 py-2 bg-gray-200 rounded" @click="cancel">
                  {{ $t('cancel_btn') }}
                </Button>
                <Button size="sm" class="g-button px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  :disabled="isSaving || !newResource.url || !newResource.name" @click="saveNewResources">
                  <spinner-cmp v-if="isSaving" />
                  {{ $t('save') }}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div class="lectureAddContent border-t-1 py-3 px-3 border-black/25" v-if="addingContent">
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
              <g-upload-files repository="Videos_Course" :file-name="item.id" source="videoCourse"
                :allow-file="ALLOW_FILE.video" :apiName="item.id" :placeholder="$t('No file selected')"
                :button-name="$t('select_Video')" type="Video" @selected="onGetVideoDetails"
                v-model="localItem.contentLink" />
            </div>
            <div class="nb">
              <span>{{ $t('lecture_video_nb') }}</span>
            </div>
          </div>
          <div v-if="documentType == 'Article'" class="mt-4">
            <g-rich-text-editor v-model="localItem.article" :label="$t('Article')" :content="item.article"
              :justify-content="true" :show-image="true" api-name="lecture" />
          </div>
          <div class="actions">
            <Button variant="neutral" @click="addingContent = false">{{ $t('cancel_btn') }}</Button>
            <Button class="save" :disabled="isSaving" @click="updateLectureContent">
              <Spinner v-if="isSaving" />
              {{ $t('save') }}
            </Button>
          </div>
        </div>
        <div class="" v-if="isQuiz">
          <div class="border-t-1 border-black/25 py-3" v-if="showDetails">
            <template v-if="!addingQuestion">
              <div class="flex justify-center gap-11">
                <div class=" flex flex-col justify-center self-center hover:bg-gray-100 cursor-pointer"
                  @click="selectType('Choice')">
                  <div class="icon self-center"><i class="bi bi-question-circle"></i></div>
                  <div class="type">{{ $t('multiple_choice') }}</div>
                </div>
                <div class="flex flex-col hover:bg-gray-100 cursor-pointer" @click="selectType('Select')">
                  <div class="icon self-center"><i class="bi bi-question-circle"></i></div>
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
  <g-confirmation :id="'item_' + item.id" ref="confirmation" @accepted="accepted" :message="$t('confirm_delete_item')"
    @cancel="refuse" :title="$t('please_confirm')" :accept-label="$t('yes')" :show-cancel="true" />
  <GConfirmation :id="'questio_' + item.id" ref="confirmationQuestion" @accepted="acceptedQuestion"
    :message="$t('confirm_delete_question')" @cancel="refuse" :title="$t('please_confirm')" />
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import router from '@/router';

import GRichTextEditor from "@/components/forms/FormElements/GRichTextEditor.vue";
import SpinnerCmp from '@/components/spinner/Spinner.vue';
import BaseInput from '@/components/forms/FormElements/BaseInput.vue';
import QuestionEdit from './../questions/QuestionEdit.vue';
import QuestionTile from './../questions/QuestionTile.vue';
import GUploadFiles from "@/components/forms/FormElements/GUploadFiles.vue";

import {
  AddResources,
  deleteLecture,
  deleteQuestion,
  deleteResources,
  getLecture,
  updateLecture
} from '@/services/griot_service';

import {
  estimateReadingTime,
  formatTime,
  getFileSize
} from '@/utilities/UtilityFunction';

import {
  LECTURE_TYPE,
  LECON_ITEMS_TYPES,
  ALLOW_FILE
} from '@/utilities/utilityConstant';

import { useToast } from 'vue-toastification'
import Button from '@/components/ui/Button.vue';
import Spinner from '@/components/spinner/Spinner.vue';
import GConfirmation from '@/components/ui/GConfirmation.vue';

const toast = useToast();
const { t } = useI18n();
const emits = defineEmits<{
  (e: 'refresh'): void;
}>();
const props = defineProps<{
  item: Record<string, any>;
}>();

const confirmation = ref<InstanceType<typeof GConfirmation> | null>(null);
const confirmationQuestion = ref<InstanceType<typeof GConfirmation> | null>(null);

const localItem = ref<Record<string, any> | null>(null);
const newResource = ref<Record<string, any>>({});
const courseId = ref<string>('');
const resourceId = ref<number | null>(null);
const questionToDelete = ref<any>(null);
const currentEditQuestion = ref<any>(null);

const isSaving = ref(false);
const typingDescription = ref(false);
const showDetails = ref(false);
const addingResources = ref(false);
const editLecture = ref(false);
const addingContent = ref(false);
const addingQuestion = ref(false);
const showQuiz = ref(false);
const hasError = ref(false);
const documentType = ref<string | null>(null);
const questionType = ref<string>('');
const actionQuestion = ref<string>('');
let action: string | null = null;

// Lifecycle
onMounted(() => {
  localItem.value = props.item;
  documentType.value = props.item.documentType || null;
  getParameters();
});

// UI Interactions
const cancel = () => {
  typingDescription.value = false;
  showDetails.value = true;
  addingResources.value = false;
  editLecture.value = false;
  addingContent.value = false;
  addingQuestion.value = false;
  hasError.value = false;

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
  // addingQuestion.value = true;
  showDetails.value = true;
};

const onHover = () => {
  return 'g-show';
};

const onLeave = () => {
  return 'g-hide';
};
const handelTypingDescription = () => {
  typingDescription.value = true;
  addingResources.value = false;
  editLecture.value = false;
  addingContent.value = false;
  addingQuestion.value = false;
  hasError.value = false;
  showDetails.value = false;


}
const editItem = () => {
  editLecture.value = true;
  typingDescription.value = false;
  addingResources.value = false;
  showDetails.value = false;
  hasError.value = false;
};

// Computed
const isLecture = computed(() => props.item.type === LECTURE_TYPE.Lecture);
const isCodingExercise = computed(() => props.item.type === LECTURE_TYPE.CodingExercise);
const isQuiz = computed(() => props.item.type === LECTURE_TYPE.Quiz);

const canAddContent = computed(() => !isCodingExercise.value);
const duration = computed(() => formatTime(props.item.duration));
const questionsList = computed(() => props.item.quiz || []);

const isCompleted = computed(() => {
  if (props.item.type === LECTURE_TYPE.Lecture) {
    return !!(props.item.documentType && (props.item.article || props.item.contentLink));
  }
  if (isQuiz.value) return props.item.quiz?.length > 0;
  if (isCodingExercise.value) return !!props.item.codingExercise;
  return false;
});

// Methods
const getParameters = () => {
  const params = router.currentRoute.value.params;
  if (params?.courseId) courseId.value = params.courseId as string;
};

const startEditLecture = () => {
  if (isCodingExercise.value && courseId.value) {
    router.push({
      name: 'codingExercise',
      params: { courseId: courseId.value },
      query: { lectureId: props.item.id }
    });
  } else {
    cancel();
    editLecture.value = true;
    showDetails.value = false
  }
};

const onGetVideoDetails = (value: { downloadURL: string; duration: number; filesize: number }) => {
  if (localItem.value) {
    localItem.value.contentLink = value.downloadURL;
    localItem.value.duration = value.duration;
    localItem.value.size = value.filesize;
  }
};

const updateItemDescription = () => {
  if (localItem.value?.description) updateLectureLocal();
};

const updateLectureContent = () => {
  if (!documentType.value || !localItem.value) return;
  localItem.value.documentType = documentType.value;
  if (documentType.value === 'Article') {
    localItem.value.duration = parseInt(`${estimateReadingTime(localItem.value.article ?? '0')}`);
  }
  updateLectureLocal();
};

const updateLectureLocal = () => {
  console.log('updateLectureLocal', localItem.value);
  if (!localItem.value?.title) {
    hasError.value = true;
    return;
  }
  isSaving.value = true;
  updateLecture(props.item.id, localItem.value)
    .then((res) => res.json())
    .then(() => {
      cancel();
      toast.success(t('lecture_update_toast'));
    })
    .catch(() => {
      toast.error(t('error_occur'));
    })
    .finally(() => (isSaving.value = false));
};

const getFileSizeLocal = (size: number) => getFileSize(size);

const refresh = () => {
  getLecture(props.item.id)
    .then((res) => res.json())
    .then((data) => {
      localItem.value = data;
    })
    .catch((err) => {
      console.error(err);
      toast.error(t('error_occur'));
    });
};

const getResourceType = (type: string) => {
  newResource.value = { type };
};

const getDownloadableFile = (value: { downloadURL: string; filesize: number; fileName: string }) => {
  newResource.value = {
    file: value.downloadURL,
    size: value.filesize,
    name: value.fileName
  };
};

const saveNewResources = () => {
  isSaving.value = true;
  AddResources(props.item.id, [newResource.value])
    .then((res) => res.json())
    .then(() => {
      cancel();
      toast.success(t('resource_add_toast'));
      refresh();
    })
    .catch((err) => {
      console.error(err);
      toast.error(t('error_occur'));
    })
    .finally(() => (isSaving.value = false));
};

const activeTab = ref('DownloadableFile');

const selectTab = (type: string) => {
  activeTab.value = type;
  getResourceType(type);
};

const tabClass = (type: string) =>
  `px-4 py-2 rounded-t font-medium ${activeTab.value === type
    ? 'bg-purple-500 text-white'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`;

// Question Handling
const confirmDeleteQuestion = (index: number) => {
  questionToDelete.value = questionsList.value[index];
  actionQuestion.value = 'deleteQuestion';
  confirmationQuestion.value?.show();
};

const acceptedQuestion = () => {
  if (!questionToDelete.value) return;
  confirmationQuestion.value?.showSpinner();
  deleteQuestion(questionToDelete.value.id)
    .then(() => {
      confirmationQuestion.value?.hide();
      emits('refresh');
      toast.success(t('question_delete_toast'));
    })
    .catch((err) => {
      console.error(err);
      toast.error(t('error_occur'));
    })
    .finally(() => confirmationQuestion.value?.hideSpinner());
};

const saveQuestion = () => {
  emits('refresh');
  addingQuestion.value = false;
  currentEditQuestion.value = null;
};

const closeEditQuestion = () => {
  addingQuestion.value = false;
  currentEditQuestion.value = null;
};

const editQuestion = (index: number) => {
  currentEditQuestion.value = questionsList.value[index];
  addingQuestion.value = true;
  actionQuestion.value = 'edit';
  questionType.value = currentEditQuestion.value?.type || '';
};

const selectType = (type: string) => {
  questionType.value = type;
  actionQuestion.value = 'new';
  addingQuestion.value = true;
};

// Delete Logic
const confirmDelete = () => {
  action = 'delete';
  confirmation.value?.show();
};

const accepted = () => {
  confirmation.value?.showSpinner();
  if (action === 'delete') deleteItem();
  else if (action === 'deleteResource') deleteResourceConfirm();
};

const deleteItem = () => {
  deleteLecture(props.item.id)
    .then((res) => {
      if (res.status === 200) {
        confirmation.value?.hideSpinner();
        confirmation.value?.hide();
        emits('refresh');
        toast(t('lecture_deleted_toast'));
      }
    })
    .catch((err) => {
      console.error(err);
      confirmation.value?.hideSpinner();
      toast(t('error_occur'));
    });
};

const deleteResource = (i: number) => {
  action = 'deleteResource';
  resourceId.value = i;
  confirmation.value?.show();
};

const deleteResourceConfirm = () => {
  if (resourceId.value === null) return;
  deleteResources(props.item.id, resourceId.value.toLocaleString())
    .then((res) => {
      if (res.status === 200) {
        refresh();
        confirmation.value?.hideSpinner();
        confirmation.value?.hide();
        toast(t('resource_delete_toast'));
      }
    })
    .catch((err) => {
      console.error(err);
      confirmation.value?.hideSpinner();
      toast(t('error_occur'));
    });
};

const refuse = () => {
  confirmation.value?.hide();
  confirmationQuestion.value?.hide();
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
  width: 200px;
  margin-bottom: 1em;
  font-weight: 700;
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
  border: 2px solid gray;
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
  background-color: purple;

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
  background-color: purple;
  border-color: purple;
}

input[type="radio"]:disabled {
  cursor: not-allowed;
}





.g-resource-downloadable {
  padding: 0.5em 1em;
}
</style>
