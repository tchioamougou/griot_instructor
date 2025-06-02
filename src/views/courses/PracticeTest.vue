<template>
  <div class="card g-box-shadow">
    <div class="card-body">
      <div class="g-block-header">
        <div class="block_title">
          <h5 class="g-title">{{$t('curriculum')}}</h5>
        </div>
        <div class="block_action">
          <button class="g-button me-3" @click="preview">{{$t('preview')}}</button>
         <!-- <button class="g-button">Bulk upload</button>-->
        </div>
      </div>
      <template v-if="loading"><g-spinner /></template>
      <template v-if="!loading">
        <div class="g-container">
          <div class="g-tip">
            <div class="title important">
              <i class="bi bi-patch-exclamation-fill"></i> {{$t('pt_tip.title')}}
            </div>
            <div class="list">
              <ul>
                <li>
                  {{$t('pt_tip.l1')}}
                  <a href="#">{{$t('pt_tip.l1_link')}}</a>.
                </li>
                <li>
                  {{$t('pt_tip.l2')}} <a href="#"> {{$t('pt_tip.l2_link')}}</a> {{$t('pt_tip.l2_2')}}
                </li>
                <li>
                 {{$t('pt_tip.l3')}}
                </li>
                <li>{{$t('pt_tip.l4')}}</li>
              </ul>
            </div>
          </div>
          <!-- Course details -->
          <div class="section">
            <div style="position: relative">
              <div class="g-pt-content-list">
                <template v-for="(pt,i) in practiceTest" :key="pt.id">
                  <practice-test-item
                    :item="pt"
                    :position ="i+1"
                    @refresh="refresh"
                    @delete ="refreshPracticeTest"
                  />
                </template>
              </div>
              <div class="g-add-more-button">
                <span @click="addPt()" v-if="!addingPt">+</span>
                <div
                  class="new_section_btn_cancel"
                  v-if="addingPt"
                  @click="cancel"
                >
                  <i class="bi bi-x-lg"></i>
                </div>
              </div>
            </div>
            <div class="new_pt" v-if="addingPt">
              <div class="new_pt_content">
                <div class="new_pt_content_label">
                  <span>{{$t('new_practice_test')}} :</span>
                </div>
                <div class="new_pt_content_input">
                  <div class="new_pt_content_div">
                    <g-input
                      :max="80"
                      show-rest
                      v-model="currentPt.title"
                      :is-error="hasError"
                      :message-error="$t('field_blank_error')"
                      :label="$t('title')"
                    />
                    <g-input
                      v-model="currentPt.description"
                      :label="$t('Description')"
                    />
                    <g-input
                      v-model="currentPt.duration"
                      :is-error="hasError"
                      :label="$t('duration')"
                      type="number"
                    />
                    <g-input
                      v-model="currentPt.minimumScore"
                      :is-error="hasError"
                      :label="$t('minimun_percentage')"
                      type="number"
                    />
                  </div>
                  <div class="new_pt_content_action">
                    <div class="actions">
                      <button class="cancel" @click="cancel">{{ $t('cancel_btn') }}</button>
                      <button
                        class="save"
                        @click="savePt"
                        :disabled="
                          isSaving ||
                          !currentPt.duration ||
                          !currentPt.minimumScore
                        "
                      >
                        <spinner-cmp v-if="isSaving" />{{$t('add_practice_test')}}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <g-toast ref="message" :duration="10000" direction="top-right" />
</template>
<script setup>
import {computed, defineAsyncComponent, ref} from "vue";
const GInput = defineAsyncComponent(()=>import('../../resources/GInput.vue')) ;
const GSpinner = defineAsyncComponent(()=>import('../../resources/GSpinner.vue')) ;
const SpinnerCmp = defineAsyncComponent(()=>import('../../resources/Spinner.vue')) ;
const PracticeTestItem = defineAsyncComponent(()=>import('./PracticeTestItem.vue')) ;
import {createPractices} from "../../database/griot";
import router from "../../router";
import GToast from "../../resources/GToast.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(['refresh']);
const errorMessage = ref(null);
const message = ref(null);
const loading = ref(false);
const addingPt = ref(false);
const hasError = ref(false);
const isSaving = ref(false);
const practiceTest = computed(()=>{return props.course.practiceTests?.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0))})
const currentPt = ref({});
const addPt = () => {
  addingPt.value = true;
  hasError.value = false;
};
const cancel = () => {
  addingPt.value = false;
};
const preview = () => {
  router.push({
    name: "courseView",
    params: { id: props.course.id },
  });
};
const savePt = () => {
  currentPt.value.position = (practiceTest.value &&practiceTest.value.length>0) ? practiceTest.value[practiceTest.value.length - 1].position + 1 :1;
  currentPt.value.courseId = props.course.id;
  currentPt.value.duration = parseInt(currentPt.value.duration);
  currentPt.value.minimumScore = parseInt(currentPt.value.minimumScore);
  if (currentPt.value.title) {
    isSaving.value = true;
    //console.log('currentPt====>',currentPt);
    createPractices([currentPt.value])
      .then((response) => {
        console.log("Response", response);
        return response.json();
      })
      .then((data) => {
        currentPt.value = {};
        message.value.toast(t("createNewCourse_practiceTest"), t('add_practice_test_msg'), "success");
        addingPt.value = false;
        props.course.practiceTests =practiceTest.value.concat(data);
        //emits("refresh");
        cancel();
      })
      .catch((error) => {
        message.value.toast(t("createNewCourse_practiceTest"), t("error_occur"), "error");
        console.error(error);
      }).finally(() => {
        isSaving.value = false;
      });
  } else {
    hasError.value = true;
  }
};
const refreshPracticeTest = (id) => {
  const filterPractice = props.course.practiceTests.filter(e => e.id !== id)
  props.course.practiceTests = filterPractice ? filterPractice:[];
}
const refresh =()=>{
  emits('refresh');
}
</script>
<style scoped>
.g-form-control .input {
  height: 1em;
}
.section {
  border: 0.01em solid rgb(128, 128, 128, 0.2);
  margin: 1em 0;
  background-color: #f5f7f9;
  padding: 0 1em;
}
.g-pt-content-list {
  margin-top: 1em;
}
</style>
