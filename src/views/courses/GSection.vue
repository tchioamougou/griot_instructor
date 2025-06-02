<template>
  <div class="accordion mt-5" id="accordionPanelsStayOpenExample">
    <div class="accordion-item">
      <div class="new_section" v-if="editingSection">
        <div class="new_section_content">
          <div class="new_section_content_label">
            <span>{{ $t('edit_section') }} :</span>
          </div>
          <div class="new_section_content_input">
            <div class="new_section_content_div">
              <g-input
                :max="80"
                :placeholder="$t('new_section_ob.title_placeholder')"
                show-rest
                v-model="currentSection.title"
                :is-error="hasError && !currentSection.title"
                :message-error="$t('field_blank_error')"
              />
              <g-input
                :label="$t('new_section_ob.objective_label')"
                :max="200"
                :placeholder="$t('new_section_ob.objective_placeholder')"
                show-rest
                v-model="currentSection.learningObjectives"
                :is-error="hasError && !currentSection.learningObjectives"
                :message-error="$t('field_blank_error')"
              />
            </div>
            <div class="new_section_content_action">
              <div class="actions">
                <button class="cancel" @click="cancel">{{ $t('cancel_btn') }}</button>
                <button
                  class="save"
                  @click="updateSectionLocal"
                  :disabled="isSaving"
                >
                  <spinner-cmp v-if="isSaving" />
                  {{ $t('edit_section') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="accordion-header"
        :id="'panelsStay-' + section.position"
        v-if="!editingSection"
      >
        <div
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="'#panelsStayOpen-' + section.position"
          aria-expanded="true"
          :aria-controls="'panelsStayOpen-' + section.position"
          @mouseover="onHover"
          @mouseleave="onLeave"
        >
          <div>
            <span class="section_label">{{ $t('section') }} {{ section.position }}: </span>
            <span class="g-text-md">{{ section.title }}</span>
            <div :class="btClass">
              <span @click="editingSection = true" class="ms-2 g-text-md"
                ><i class="bi bi-pencil-fill"></i
              ></span>
              <span @click="confirmDelete" class="ms-2 g-text-md"
                ><i class="bi bi-x-circle"></i
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div
        :id="'panelsStayOpen-' + section.position"
        class="accordion-collapse collapse show"
        :aria-labelledby="'panelsStayOpen-' + section.position"
      >
        <div class="accordion-body">
          <!--Item-->
          <div v-for="it in section.lectures" :key="it.id">
            <g-item :item="it" @refresh="refresh" />
          </div>

          <div class="g-add-more-button">
            <span @click="addItem" v-if="!addingItem">+</span>
            <span @click="cancel" v-if="addingItem"
              ><i class="bi bi-x"></i
            ></span>
          </div>
          <div class="g-add-item" v-if="addingItem">
            <div class="step1" v-if="step === 1">
              <span @click="selectItemType('Lecture')"> + {{ $t('Lecture') }} </span>
              <span @click="selectItemType('Quiz')"> + {{ $t('Quiz') }} </span>
              <span @click="selectItemType('Coding Exercise')">
                + {{ $t('Coding Exercise') }}
              </span>
              <span @click="selectItemType('Practice Test')">
                + {{ $t('Practice Test') }}
              </span>
              <span @click="selectItemType('Assigment')"> + {{ $t('Assigment') }} </span>
            </div>
            <div class="step2" v-if="step === 2">
              <div class="lecture_edit">
                <div class="lecture_edit_content">
                  <span class="title">{{ $t('title') }}: </span>
                  <div class="input">
                    <g-input
                      v-model="newItem.title"
                      :max="80"
                      show-rest
                      :placeholder="$t('title_placeholder')"
                      :is-error="hasError && !newItem.title"
                      :message-error="$t('field_blank_error')"
                    />
                    <g-input
                      v-model="newItem.description"
                      :max="80"
                      show-rest
                      :placeholder="$t('description_placeholder')"
                      :is-error="hasError&&!newItem.description"
                      :message-error="$t('field_blank_error')"
                    />
                  </div>
                </div>
                <div class="actions">
                  <button @click="cancel">{{ $t('cancel_btn') }}</button>
                  <button
                    class="save"
                    :disabled="isSaving"
                    @click="saveNewItem"
                  >
                    <spinner-cmp v-if="isSaving" />
                    {{ $t('add') }} {{ $t(newItem.type) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Spinner -->
  <g-toast ref="message" :duration="10000" direction="top-right" />
  <g-confirmation
    :id="'section_confirm_' + section.id"
    ref="confirmation"
    @accepted="accepted"
    :message="$t('confirm_delete_item')"
    @cancel="refuse"
    :title="$t('please_confirm')"
  />
</template>
<script setup>
import GToast from "../../resources/GToast.vue";
import SpinnerCmp from "../../resources/Spinner.vue";
import GConfirmation from "../../resources/GConfirmation.vue";
import {
  createLectures,
  createSections,
  deleteSection,
  updateSection,
} from "../../database/griot";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
});
let action = "";
const emits = defineEmits(["refresh"]);
const currentSection = ref({});
const isSaving = ref(false);
const editingSection = ref(false);
const hasError = ref(false);
const addingItem = ref(false);
const updateSectionLocal = () => {
  if (!currentSection.value.title || !currentSection.value.learningObjectives) {
    hasError.value = true;
    return;
  }

  isSaving.value = true;
  let section = currentSection.value;
  updateSection(props.section.id, section)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("updateSectionLocal", data);
      isSaving.value = false;
      emits("refresh");
      cancel();
      message.value.toast(t("Section"), t('section_updated'), "success");
    })
    .catch((error) => {
      console.log("createSessions=> error", error);
      message.value.toast(t("Section"), t('error_occur'), "error");
      isSaving.value = false;
    });
};
const deleteSectionLocal = () => {
  deleteSection(props.section.id)
    .then((response) => {
      if (response.status === 200) {
        emits("refresh");
      }
    })
    .catch((error) => {
      console.log("delete record error", error);
    });
};
const cancel = () => {
  editingSection.value = false;
  hasError.value = false;
  addingItem.value = false;
  newItem = {};
};
const confirmDelete = () => {
  action = "delete";
  confirmation.value.show();
};
const accepted = () => {
  if (action === "delete") {
    deleteSectionLocal();
  }
  confirmation.value.hide();
};
const refuse = () => {
  confirmation.value.hide();
};
onMounted(() => {
  currentSection.value = { ...props.section };
});
const message = ref(null);
const confirmation = ref(null);

/** here we defined element to manage all Lectures elements*/
let newItem = {};
const step = ref(1);
const addItem = () => {
  addingItem.value = true;
  step.value = 1;
  newItem = {};
};
const selectItemType = (type) => {
  newItem.type = type;
  step.value = 2;
};
const saveNewItem = () => {
  if(!newItem.title ||
    !newItem.description){
    hasError.value = true;
    return;
  }
  const lecture = {
    ...newItem,
    learningObjectives: "",
    position: props.section.lectures.length + 1,
    documentType: "",
    contentLink: "",
    sectionId: props.section.id,
  };
  isSaving.value = true;
  console.log("Lectures==>", lecture);
  createLectures([lecture])
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("saveNewItem", data);
      isSaving.value = false;
      emits("refresh");
      cancel();
      message.value.toast("Success", "Section Created Lecture", "success");
    })
    .catch((error) => {
      console.log("createSessions=> error", error);
      isSaving.value = false;
    });
};
const refresh = () => {
  emits("refresh");
};
</script>
<script>
import GInput from "../../resources/GInput.vue";
import GSelect from "../../resources/GSelect.vue";
import GItem from "./GItem.vue";
export default {
  components: { GItem, GSelect, GInput },
  data: function () {
    return {
      btClass: "g-hide",
    };
  },
  methods: {
    onHover() {
      this.btClass = "g-show";
    },
    onLeave() {
      this.btClass = "g-hide";
    },
  },
};
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

.lecture_edit .lecture_edit_content title {
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
</style>
