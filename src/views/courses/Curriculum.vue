<template>
  <ItemLayout :title="$t('curriculum')">
    <template #main>
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
        <div style="position: relative" class="mt-10 ">
          <template v-for="section in sortedSections" :key="section.position">
            <g-section :section="section" @refresh="refresh" :course="course" />
          </template>
          <div class="g-add-more-button mt-6">
            <button @click="addSection()" v-if="!addingSection" class="border-1 text-sm hover:bg-gray-200 rounded px-2 py-1 border-purple-400 "> + {{ $t('section') }}</Button>
            <div
              class="new_section_btn_cancel"
              v-if="addingSection"
              @click="cancel"
            >
              <i class="bi bi-x-lg"></i>
            </div>
          </div>
        </div>
        <div class="border-1 px-4 py-3 rounded border-black/25 mb-10" v-if="addingSection">
          <div class="new_section_content">
            <div class="new_section_content_label text-sm">
              <span>{{ $t('new_section') }} :</span>
            </div>
            <div class="new_section_content_input">
              <div class="new_section_content_div">
                <BaseInput
                  :placeholder="$t('new_section_ob.title_placeholder')"
                  show-rest
                  v-model="currentSection.title"
                  :maxlength="80"
                />
                <BaseInput
                  :label="$t('new_section_ob.objective_label')"
                  :maxlength="200"
                  :placeholder="$t('new_section_ob.objective_placeholder')"
                  show-rest
                  v-model="currentSection.learningObjectives"
                  :is-error="hasError && !currentSection.learningObjectives"
                  :message-error="$t('field_blank_error')"
                />
              </div>
              <div class="new_section_content_action">
                <div class="flex justify-end gap-2">
                  <Button variant="neutral" class="cancel" @click="cancel" size="sm">{{ $t('cancel_btn') }}</button>
                  <Button
                    class="save"
                    @click="saveSection"
                    :disabled="isSaving"
                    :size="'sm'"
                  >
                    <Spinner v-if="isSaving" />
                    {{$t('add_section')}}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ItemLayout>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

import GSection from "./sections/GSection.vue";
import BaseInput from '@/components/forms/FormElements/BaseInput.vue';
import ItemLayout from './items/ItemLayout.vue';
import { createSections } from "@/services/griot_service.ts";
import { useToast } from 'vue-toastification'
import Spinner from "@/components/spinner/Spinner.vue";
const toast = useToast();
import { useI18n } from "vue-i18n";
import Button from "@/components/ui/Button.vue";
const { t } = useI18n();  
const router = useRouter();

const emits = defineEmits<{
  (e: "refresh"): void;
}>();

const props = defineProps<{
  course: Record<string, any> 
}>();

const isSaving = ref(false);
const currentSection = ref<Partial<Record<string,any>>>({});
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

const saveSection = () => {
  if (
    !currentSection.value.title ||
    !currentSection.value.learningObjectives
  ) {
    hasError.value = true;
    return;
  }

  isSaving.value = true;

  const section: Record<string,any> = {
    ...currentSection.value,
    courseId: props.course.id,
    position: props.course.sections.length + 1,
  };

  createSections([section])
    .then((response) => response.json())
    .then((data) => {
      console.log("createSections", data);
      isSaving.value = false;
      emits("refresh");
      cancel();
      toast.success("Section Created successfully");
    })
    .catch((error) => {
      console.error("createSections error", error);
      toast.error(t('error_occur'));
      isSaving.value = false;
    });
};

const refresh = () => {
  emits("refresh");
};

const preview = () => {
  router.push({
    name: "courseView",
    params: { id: props.course.id },
  });
};

const sortedSections = ref<Array<Record<string, any>>>([]);

const init = () => {
  if (props.course.sections) {
    // Deep copy and sort sections and lectures to avoid mutating props
    sortedSections.value = props.course.sections
      .map((section:any) => ({
        ...section,
        lectures: section.lectures
          ? [...section.lectures].sort((l1: Record<string, any>, l2: Record<string, any>) => l1.position - l2.position)
          : []
      }))
      .sort((a: Record<string, any>, b: Record<string, any>) => a.position - b.position);
  } else {
    sortedSections.value = [];
  }
};

watch(() => props.course, () => init(), { immediate: true });
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
}

.new_section_content_input {
  width: 90%;
}
</style>
