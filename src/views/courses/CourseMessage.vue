<template>
  <ItemLayout :title="$t('cs_ms.title')">
    <template #main>
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
            :content="course.welcomeMessage" api-name="welcomeMessage" :show-image="false" />
        </div>
        <!-- Welcome message-->
        <div class="mt-2 mb-2">
          <g-rich-text-editor :label="$t('cs_ms.congratulation_message')"
            v-model="localCourseInfo.congratulationsMessage" :content="course.congratulationsMessage"
            api-name="congratulationsMessage" :show-image="false" />
        </div>

      </template>
    </template>
  </ItemLayout>
</template>
<script setup lang="ts">
import GRichTextEditor from "@/components/forms/FormElements/GRichTextEditor.vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { coursesMessage } from "@/services/griot_service";
import { useI18n } from "vue-i18n";
import ItemLayout from "./items/ItemLayout.vue";
import { useToast } from 'vue-toastification'
import { emitter } from "@/events/emitter.ts";

onMounted(() => {
  emitter.on("save-course-messages", updateCourseMessage);
});
onBeforeUnmount(() => {
  emitter.off("save-course-messages", updateCourseMessage);
});
const toast = useToast();
const { t } = useI18n();
const emits = defineEmits(['refresh']);
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});
const localCourseInfo = ref({
  welcomeMessage: '',
  congratulationsMessage: ''
});
const loading = false;
const isSaving = ref(false);
const updateCourseMessage = () => {
  isSaving.value = true;
  coursesMessage(props.course.id, localCourseInfo.value)
    .then((response) => {
      response.json();
    })
    .then((result) => {
      toast.success(t('cs_ms.success_message'));
      emits('refresh');
    })
    .catch((e) => {
      toast.error(t('error_occur'));
    }).finally(() => {
      isSaving.value = false;
    })
};
localCourseInfo.value.welcomeMessage = props.course.welcomeMessage;
localCourseInfo.value.congratulationsMessage = props.course.congratulationsMessage;
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
