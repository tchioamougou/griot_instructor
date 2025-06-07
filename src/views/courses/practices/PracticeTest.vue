<template>
  <ItemLayout :title="$t('curriculum')">
    <template #main>
      <div class="g-container">
        <div class="g-tip">
          <div class="title important">
            <i class="bi bi-patch-exclamation-fill"></i> {{ $t('pt_tip.title') }}
          </div>
          <div class="list">
            <ul>
              <li>
                {{ $t('pt_tip.l1') }}
                <a href="#">{{ $t('pt_tip.l1_link') }}</a>.
              </li>
              <li>
                {{ $t('pt_tip.l2') }} <a href="#"> {{ $t('pt_tip.l2_link') }}</a> {{ $t('pt_tip.l2_2') }}
              </li>
              <li>
                {{ $t('pt_tip.l3') }}
              </li>
              <li>{{ $t('pt_tip.l4') }}</li>
            </ul>
          </div>
        </div>
        <!-- Course details -->
        <div class="border-1 px-4 py-3 rounded border-black/25 mb-10 mt-10">
          <div style="position: relative">
            <div class="g-pt-content-list">
              <template v-for="(pt, i) in practiceTest" :key="pt.id">
                <practice-test-item :item="pt" :position="i + 1" @refresh="refresh" @delete="refresh" />
              </template>
            </div>
            <div class="g-add-more-button">
              <button @click="addPt()" v-if="!addingPt" class="border-1 text-sm hover:bg-gray-200 rounded px-2 py-1 border-purple-400 "> + {{ $t('practiceTest') }}</Button>
              <div class="new_section_btn_cancel cursor-pointer text-red-500" v-if="addingPt" @click="cancel">
                <i class="bi bi-x-lg"></i>
              </div>
            </div>
          </div>
          <div class="new_pt" v-if="addingPt">
            <div class="new_pt_content">
              <div class="new_pt_content_label font-bold mb-3 mt-4">
                <span>{{ $t('new_practice_test') }} :</span>
              </div>
              <div class="new_pt_content_input">
                <div class="new_pt_content_div">
                  <g-input :maxlength="80" show-rest v-model="currentPt.title" :is-error="hasError"
                    :message-error="$t('field_blank_error')" :label="$t('title')" />
                  <GRichTextEditor  v-model="currentPt.description" :label="$t('Description')" api-name="apdescription" ></GRichTextEditor>
                  <g-input v-model="currentPt.duration" :is-error="hasError" :label="$t('duration')" type="number" />
                  <g-input v-model="currentPt.minimumScore" :is-error="hasError" :label="$t('minimun_percentage')"
                    type="number" />
                </div>
                <div class="new_pt_content_action">
                  <div class="flex justify-end gap-3">
                    <Button size="sm" variant="neutral" class="cancel" @click="cancel">{{ $t('cancel_btn') }}</button>
                    <Button size ="sm" class="save" @click="savePt" :disabled="isSaving ||
                      !currentPt.duration ||
                      !currentPt.minimumScore
                      ">
                      <spinner-cmp v-if="isSaving" />{{ $t('add_practice_test') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #right>
      <Button @click="preview" size="sm">{{ $t('preview') }}</Button>
    </template>
  </ItemLayout>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue";
const GInput = defineAsyncComponent(() => import('@/components/forms/FormElements/BaseInput.vue'));
const SpinnerCmp = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'));
const PracticeTestItem = defineAsyncComponent(() => import('./PracticeTestItem.vue'));
import { createPractices } from "@/services/griot_service";
import router from "../../../router";
import { useI18n } from "vue-i18n";
import ItemLayout from "../items/ItemLayout.vue";
import Button from "@/components/ui/Button.vue";
import GRichTextEditor from "@/components/forms/FormElements/GRichTextEditor.vue";
import { useToast } from 'vue-toastification'

const toast = useToast();
const { t } = useI18n();
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(['refresh']);
const addingPt = ref(false);
const hasError = ref(false);
const isSaving = ref(false);
const practiceTest = computed(() => {
  return props.course.practiceTests
    ? [...props.course.practiceTests].sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0))
    : [];
});
const currentPt = ref<Record<string,any>>({});
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
  currentPt.value.position = (practiceTest.value && practiceTest.value.length > 0) ? practiceTest.value[practiceTest.value.length - 1].position + 1 : 1;
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
       toast.success(t('add_practice_test_msg'));
        addingPt.value = false;
        emits("refresh");
        cancel();
      })
      .catch((error) => {
        toast.error(t("error_occur"));
        console.error(error);
      }).finally(() => {
        isSaving.value = false;
      });
  } else {
    hasError.value = true;
  }
};
const refresh = () => {
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
