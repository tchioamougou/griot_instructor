<template>
  <div class="mt-5">
    <div class="border rounded-lg mt-5">
      <div v-if="editingSection" class="p-4 border-b">
        <div class="flex items-center mb-4">
          <span class="font-bold text-lg">{{ $t('edit_section') }}:</span>
        </div>
        <div class="space-y-4">
          <BaseInput :max="80" :placeholder="$t('new_section_ob.title_placeholder')" show-rest
            v-model="currentSection.title" :is-error="hasError && !currentSection.title"
            :message-error="$t('field_blank_error')" />
          <BaseInput :label="$t('new_section_ob.objective_label')" :max="200"
            :placeholder="$t('new_section_ob.objective_placeholder')" show-rest
            v-model="currentSection.learningObjectives" :is-error="hasError && !currentSection.learningObjectives"
            :message-error="$t('field_blank_error')" />
          <div class="flex justify-end space-x-2">
            <button class="px-4 py-2 border rounded" @click="cancel">{{ $t('cancel_btn') }}</button>
            <button class="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50" :disabled="isSaving"
              @click="updateSectionLocal">
              <spinner-cmp v-if="isSaving" />
              {{ $t('edit_section') }}
            </button>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="flex justify-between items-center text-sm p-4 cursor-pointer hover:bg-gray-100"
          @mouseover="btClass = 'inline'" @mouseleave="btClass = 'hidden'">
          <div>
            <span class="font-bold">{{ $t('section') }} {{ section.position }}:</span>
            <span class="ml-2">{{ section.title }}</span>
          </div>
          <div :class="btClass">
            <i class="bi bi-pencil-fill cursor-pointer ml-2" @click="editingSection = true"></i>
            <i class="bi bi-x-circle cursor-pointer ml-2" @click="confirmDelete"></i>
          </div>
        </div>
        <div class="p-4 bg-gray-50">
          <!-- <div v-for="it in section.lectures" :key="it.id">
            <g-item :item="it" @refresh="refresh" :course="course" />
          </div>-->
          <!-- use vuejs draggable to change course position -->

          <draggable v-model="lectures" item-key="id" ghost-class="drag-ghost" handle=".drag-handle" @end="dragEnd">
            <template #item="{ element }">
              <div class="relative">
                <div class="drag-handle cursor-move ">
                  <GItem :item="element" @refresh="refresh" :course="course" />
                </div>

              </div>
            </template>
          </draggable>

          <div class="mt-2">

            <button @click="addItem" v-if="!addingItem"
              class="border-1 text-sm hover:bg-gray-200 rounded px-2 py-1 border-purple-400 ">
              + {{ $t('curriculum item') }}</Button>
            <span v-else class="text-red-600 cursor-pointer" @click="cancel">
              <i class="bi bi-x"></i>
            </span>
          </div>

          <div v-if="addingItem" class="mt-4">
            <div v-if="step === 1" class="border p-4 space-x-4">
              <span v-for="type in itemTypes" :key="type" class="text-blue-700 font-semibold cursor-pointer"
                @click="selectItemType(type)">
                + {{ $t(type) }}
              </span>
            </div>
            <div v-if="step === 2" class="border p-4 mt-4">
              <div class="mb-4">
                <BaseInput v-model="newItem.title" :maxlength="80" show-rest :placeholder="$t('title_placeholder')"
                  :label="$t('title')" :is-error="hasError && !newItem.title"
                  :message-error="$t('field_blank_error')" />
                <BaseInput v-model="newItem.description" :maxlength="80" show-rest :label="$t('Description')"
                  :placeholder="$t('description_placeholder')" :is-error="hasError && !newItem.description"
                  :message-error="$t('field_blank_error')" />
              </div>
              <div class="flex justify-end space-x-2">
                <Button size="sm" variant="neutral" @click="cancel">{{ $t('cancel_btn') }}</button>
                <Button size="sm" :disabled="isSaving" @click="saveNewItem">
                  <spinner-cmp  v-if="isSaving" />
                  {{ $t('add') }} {{ $t(newItem.type) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <g-confirmation :id="'section_confirm_' + section.id" ref="confirmation" @accepted="accepted" @cancel="refuse"
      :message="$t('confirm_delete_item')" :title="$t('please_confirm')" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { createLectures, deleteSection, updateSection, updateLecturesPositions } from '@/services/griot_service.ts';
import BaseInput from '@/components/forms/FormElements/BaseInput.vue';
import GItem from './GItem.vue';
import Button from '@/components/ui/Button.vue';
import SpinnerCmp from '@/components/spinner/Spinner.vue';
import GConfirmation from '@/components/ui/GConfirmation.vue';
import { useToast } from 'vue-toastification'
import draggable from 'vuedraggable'


const toast = useToast();
const { t } = useI18n();
const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
  course: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(['refresh']);
const currentSection = ref({ ...props.section });
const isSaving = ref(false);
const editingSection = ref(false);
const hasError = ref(false);
const addingItem = ref(false);
const step = ref(1);
const btClass = ref('hidden');
const confirmation = ref();
const action = ref('');
const lectures = ref([]);

let newItem: any = {};
const itemTypes = ['Lecture', "Practice Test", "Quiz"]; // 'Coding Exercise',', , 'Assigment'// "Quiz"

const updateSectionLocal = () => {
  if (!currentSection.value.title || !currentSection.value.learningObjectives) {
    hasError.value = true;
    return;
  }
  isSaving.value = true;
  updateSection(props.section.id, currentSection.value)
    .then(res => res.json())
    .then(() => {
      isSaving.value = false;
      emits('refresh');
      cancel();
      toast.success(t('section_updated'));
    })
    .catch(err => {
      console.error(err);
      toast.error(t('error_occur'),);
      isSaving.value = false;
    });
};

const deleteSectionLocal = () => {
  deleteSection(props.section.id)
    .then(res => {
      if (res.status === 200) emits('refresh');
    })
    .catch(console.error);
};

const cancel = () => {
  editingSection.value = false;
  hasError.value = false;
  addingItem.value = false;
  newItem = {};
};

const confirmDelete = () => {
  action.value = 'delete';
  confirmation.value.show();
};

const accepted = () => {
  if (action.value === 'delete') deleteSectionLocal();
  confirmation.value.hide();
};

const refuse = () => confirmation.value.hide();

const addItem = () => {
  addingItem.value = true;
  step.value = 1;
  newItem = {};
};

const selectItemType = (type: string) => {
  newItem.type = type;
  step.value = 2;
};

const saveNewItem = () => {
  if (!newItem.title || !newItem.description) {
    hasError.value = true;
    return;
  }
  const lecture = {
    ...newItem,
    learningObjectives: '',
    position: props.section.lectures.length + 1,
    documentType: '',
    contentLink: '',
    sectionId: props.section.id,
  };
  isSaving.value = true;
  createLectures([lecture])
    .then(res => res.json())
    .then(() => {
      isSaving.value = false;
      emits('refresh');
      cancel();
      toast.success(t('toast_success'));
    })
    .catch(err => {
      console.error(err);
      isSaving.value = false;
    });
};
onMounted(() => {
  lectures.value = props.section.lectures ?? []
})
const refresh = () => emits('refresh');
const updatePositions = async () => {
  const results: any = [];
  lectures.value.forEach((lecture: any, index) => {
    const position = index + 1;
    if (lecture.position != position) {
      results.push({ position: position, id: lecture.id });
    }
    lecture.position = index + 1
  });
  if (results.length > 0) {
   await updateLecturesPositions(results);
  }
}

const dragEnd = () => {
  updatePositions();
  refresh();
}
</script>

<style scoped>
.modal-content {
  -webkit-border-radius: 0 !important;
  -moz-border-radius: 0 !important;
  border-radius: 0 !important;
}

.accordion-item {
  -webkit-border-radius: 0 !important;
  -moz-border-radius: 0 !important;
  border-radius: 0 !important;
}

.g-hide {
  display: none;
}

.g-show {
  display: inline;
}

.section {
  color: white;
  cursor: pointer;
  padding: 1em;
  width: 15px;
}

.section:hover {
  color: black;
  border: 1px red dashed;
  border-bottom-right-radius: 100%;
  border-top-right-radius: 100%;
}

.new_section {
  padding: 0 1em;
  border: 0.1em black solid;
  margin-top: 0.2em;
}

.new_section_content {
  display: flex;
  flex-direction: row;
}

.new_section_content_label {
  font-family: sans-serif;
  font-weight: 900;
  width: 15%;
  padding: 1.5em 0;
}

.actions {
  display: flex;
  flex-direction: row;
  justify-content: right;
  margin: 0.5em 0;
  padding-right: 1em;
}

.actions button {
  border: none;
  outline: none;
  padding: 0.5em 1em;
  background-color: white;
  font-family: sans-serif;
}

.actions button.save {
  background-color: var(--g-c-blue-dark);
  color: white;
  margin-left: 0.5em;
}

.lecture_edit {
  padding: 0 1em;
  font-family: sans-serif;
  border: 1px black dashed;
  margin: 1em 0;
}

.lecture_edit .lecture_edit_content {
  display: flex;
  flex-direction: row;
}

.lecture_edit .lecture_edit_content title {}

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

.lecture_edit .title {
  font-family: sans-serif;
  font-weight: 900;
  width: 5%;
  padding: 1.5em 0;
}

.lecture_edit .input {
  width: 100%;
}

.step1 {
  border: black 1px dashed;
  padding: 0.5em 1em;
}

.step1 span {
  color: blue;
  font-family: sans-serif;
  font-weight: 700;
  margin: 0 1em;
  cursor: pointer;
}

.accordion-body {
  background-color: rgb(247, 249, 250, 0.7);
}

.button_header {
  padding: 1em 1em;
}

.section_label {
  font-family: sans-serif;
  font-weight: 900;
  font-size: 1.5em;
}

.accordion-button {
  background-color: rgb(247, 249, 250, 0.7);
  box-shadow: none !important;
}

.accordion {
  --bs-accordion-btn-focus-border-color: #86b7fe;
  --bs-accordion-btn-focus-box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  --bs-accordion-body-padding-x: 1.25rem;
  --bs-accordion-body-padding-y: 1rem;
  --bs-accordion-active-color: black;
  --bs-accordion-active-bg: rgb(247, 249, 250, 0.7);
}

.new_section_content_input {
  width: 90%;
}

.drag-ghost {
  background-color: #f3f4f6;
  /* équivalent Tailwind bg-gray-100 */
  border: 2px dashed #a855f7;
  /* équivalent border-2 border-dashed border-purple-500 */
}
</style>
