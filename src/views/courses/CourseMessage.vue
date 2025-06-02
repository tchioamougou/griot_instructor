<template>
  <g-toast />
  <div class="card shadow">
    <div class="card-body">
      <div class="g-block-header">
        <div class="block_title">
          <h5 class="g-title">{{ $t('cs_ms.title') }}</h5>
        </div>
      </div>
      <div class="g-container">
        <template v-if="loading">
          <g-spinner />
        </template>
        <template v-if="!loading">
          <div class="g-tip rounded">
            <div class="title">
              <i class="bi bi-patch-exclamation-fill"></i> {{ $t('Tips') }}
            </div>
            <div class="list">
              <ul>
                <li>
                  {{ $t('cs_ms.tips_1') }}
                </li>
                <li>
                  {{ $t('cs_ms.tips_2') }}
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-4"></div>
          <!-- Welcome message-->
          <div class="mt-2 mb-5">
            <g-rich-text-editor :label="$t('cs_ms.welcome_message')" v-model="localCourseInfo.welcomeMessage"
              :content="course.welcomeMessage" api-name="welcomeMessage" :show-image="true" />
          </div>
          <!-- Welcome message-->
          <div class="mt-2 mb-2">
            <g-rich-text-editor :label="$t('cs_ms.congratulation_message')"
              v-model="localCourseInfo.congratulationsMessage" :content="course.congratulationsMessage"
              api-name="congratulationsMessage" :show-image="true" />
          </div>
          <div class="g-center">
            <button type="button" class="g-button rounded" @click="updateCourseMessage" :disabled="saveDisabled">
              <span v-if="isSaving">
                <span class="spinner-border text-white spinner-border-sm" role="status"></span>
              </span>
              <span class="visually-hidden">Loading...</span>
              <span class="ms-1">{{ $t("save") }}</span>
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
  <g-toast ref="message" :duration="10000" direction="top-right" />
</template>
<script setup>
import GRichTextEditor from "../../resources/GRichTextEditor.vue";
import GSpinner from "../../resources/GSpinner.vue";
import GToast from "../../resources/GToast.vue";
import { computed, ref } from "vue";
import { coursesMessage } from "../../database/griot";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emits = defineEmits(['refresh']);
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});
const localCourseInfo = ref({});
const loading = false;
const isSaving = ref(false);
const message = ref(null);
const updateCourseMessage = () => {
  isSaving.value = true;
  coursesMessage(props.course.id, localCourseInfo.value)
    .then((response) => {
      response.json();
    })
    .then((result) => {
      message.value.toast(t('cs_ms.title'), t('cs_ms.success_message'), "success");
      emits('refresh');
    })
    .catch((e) => {
      message.value.toast(t('cs_ms.title'), t('error_occur'), "error");
    }).finally(() => {
      isSaving.value = false;
    })
};
localCourseInfo.value.welcomeMessage = props.course.welcomeMessage;
localCourseInfo.value.congratulationsMessage = props.course.congratulationsMessage;
const saveDisabled = computed(() => { return isSaving.value || (localCourseInfo.value.welcomeMessage == props.course.welcomeMessage && localCourseInfo.value.congratulationsMessage == props.course.congratulationsMessage) })
</script>
<style scoped>
.g-title {
  margin-bottom: 12px;
  font-size: larger;
}

.g-header {
  font-size: 40px;
  padding: 12px;
  border-bottom: 2px gray solid;
}

.g-container {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
