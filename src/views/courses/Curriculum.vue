<template>
  <div class="card g-box-shadow">
    <div class="card-body">
      <div class="g-block-header">
        <div class="block_title">
          <h5 class="g-title">{{$t('curriculum')}}</h5>
        </div>
        <div class="block_action">
          <button class="g-button me-3" @click="preview">{{ $t('preview') }}</button>
          <button class="g-button">{{ $t('bulk_upload') }}</button>
        </div>
      </div>
      <div class="g-container">
        <div class="g-tip">
          <div class="title important">
            <i class="bi bi-patch-exclamation-fill"></i> {{
              $t('curriculum_ob.tips.title')
            }}
          </div>
          <div class="list">
            <ul>
              <li>
                {{$t('curriculum_ob.tips.item_1')}}
                <a href="#"> {{$t('curriculum_ob.tips.item_1_url')}}</a>
              </li>
              <li>
                {{$t('curriculum_ob.tips.item_2')}}
              </li>
              <li>
                {{$t('curriculum_ob.tips.item_3')}}
              </li>
            </ul>
          </div>
        </div>
        <!-- Course details -->
        <div style="position: relative">
          <template v-for="section in course.sections" :key="section.position">
            <g-section :section="section" @refresh="refresh" />
          </template>
          <div class="g-add-more-button">
            <span @click="addSection()" v-if="!addingSection">+</span>
            <div
              class="new_section_btn_cancel"
              v-if="addingSection"
              @click="cancel"
            >
              <i class="bi bi-x-lg"></i>
            </div>
          </div>
        </div>
        <div class="new_section" v-if="addingSection">
          <div class="new_section_content">
            <div class="new_section_content_label">
              <span>{{ $t('new_section') }} :</span>
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
                    @click="saveSection"
                    :disabled="isSaving"
                  >
                    <spinner-cmp v-if="isSaving" />
                    {{$t('add_section')}}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <g-toast ref="message" :duration="10000" direction="top-right" />
</template>
<script setup>
import GSection from "./GSection.vue";
import GInput from "../../resources/GInput.vue";
import GToast from "../../resources/GToast.vue";
import SpinnerCmp from "../../resources/Spinner.vue";
import {ref, watch} from "vue";
import { createSections } from "../../database/griot";
import router from "../../router";
const emits = defineEmits(["refresh"]);
const loading = ref(false);
const isSaving = ref(false);
const currentSection = ref({});
const addingSection = ref(false);
const hasError = ref(false);
const cancel = () => {
  addingSection.value = false;
  currentSection.value = {};
};
const addSection = () => {
  addingSection.value = true;
  hasError.value = false;
};
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});
const saveSection = () => {
  if (!currentSection.value.title || !currentSection.value.learningObjectives) {
    hasError.value = true;
    return;
  }
  isSaving.value = true;
  let section = currentSection.value;
  section.courseId = props.course.id;
  section.position = props.course.sections.length + 1;
  createSections([section])
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("createSessions", data);
      isSaving.value = false;
      emits("refresh");
      cancel();
      message.value.toast("Success", "Section Created successfully", "success");
    })
    .catch((error) => {
      console.log("createSessions=> error", error);
      isSaving.value = false;
    });
};
const refresh = () => {
  emits("refresh");
};
const message = ref(null);
const preview = () => {
  router.push({
    name: "courseView",
    params: { id: props.course.id },
  });
};
watch(()=>props.course,(value)=>{init()})
const init = () => {
  props.course.sections
    ?.sort((a, b) => {
      return a.position - b.position;
    })
    .forEach((e) =>
      e.lectures?.sort((l, l2) => {
        return l.position - l2.position;
      })
    );
};
init();
</script>
<style scoped>
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

.new_section_content_input {
  width: 90%;
}
</style>
