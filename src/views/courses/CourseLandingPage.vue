<template>
  <ItemLayout :course="props.course" :title="$t('CourseLandingPage')">
    <template #main>
      <div class="g-container">
        <div class="g-tip">
          <div class="title important">
            <i class="bi bi-patch-exclamation-fill"></i> {{ $t("important") }}
          </div>
          <div class="list">
            <ul>
              <li>
                {{ $t("lan.tip_1") }}
              </li>
              <li>
                {{ $t("lan.tip_2") }}
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-8">

          <div v-if="hasError" class="text-danger mt-2 g-text-bold">
            {{ $t("lan.required_field_message") }}
          </div>
          <!--  Course Title-->
          <BaseInput v-model="localCourseInfo.title" type="text" :placeholder="$t('lan.course_title_place_holder')"
            :label="$t('lan.course_title')" show-rest :max="80" show-description required :maxlength="80"
            :is-error="hasError && !localCourseInfo.title" :description="$t('lan.course_title_description')" />
          <!-- Course subTitle-->
          <BaseInput v-model="localCourseInfo.subTitle" type="text"
            :placeholder="$t('lan.course_subtitle_place_holder')" :label="$t('lan.course_subtitle')" show-rest
            :max="200" required show-description :is-error="hasError && !localCourseInfo.subTitle" :maxlength="120"
            :description="$t('lan.course_subtitle_description')" />
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <BaseSelect v-model="localCourseInfo.language" label="Language" :options="languages" placeholder="Select Language" />
            <BaseSelect v-model="localCourseInfo.level" :label="$t('lan.course_level')" :options="levels" placeholder="Select Level" />
            <div>
              <BaseSelect v-model="courseCategory" :label="$t('category')" :options="categoriesOptions"
                placeholder="Select Category" />
              <BaseSelect v-model="courseSubCategory" :label="$t('subCatgory')" :options="courseSubCategoryOptions"
                placeholder="Select Subcategory" />
            </div>
          </div>


          <div class="mt-4">
            <GRichTextEditor v-model="localCourseInfo.description" :content="localCourseInfo.description"
              :justify-content="true" :label="$t('lan.course_description')"
              :description="$t('lan.course_description_des')" :min="2000" :max="5000" :show-image="true" />
          </div>
          <!-- Course image -->
          <div class="mt-4 mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t("lan.course_image") }}
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Preview image -->
              <div class="flex  items-center">
                <img :src="localCourseInfo.picture" class="w-[500px] h-[300px] object-cover rounded-md shadow"
                  alt="course image" title="course image" v-if="localCourseInfo.picture" />
                   <img src="@/assets/images/placeholder.png" v-else
                  class="w-[500px] h-[300px] object-cover rounded-md shadow" alt="video placeholder" />
              </div>
              <!-- Upload section -->
              <div>
                <span class="block text-sm text-gray-600 mb-2">
                  {{ $t("lan.course_image_description") }}
                </span>
                <g-upload-files v-model="localCourseInfo.picture" repository="CourseImages" source="CourseImage" :allow-file="ALLOW_FILE.image"
                  :course="course" :placeholder="$t('upload_file')" apiName="courseImage" type="Image" :button-name="$t('upload')"
                                    />
              </div>
            </div>
          </div>

          <!-- Promotional video -->
          <div class="mt-2 mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t("lan.course_promotion_video") }}
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">


              <!-- Preview video -->
              <div class="flex  items-center">
                <video class="w-[600px] h-[300px] rounded-md shadow" controls v-if="localCourseInfo.promotionalVideo">
                  <source :src="localCourseInfo.promotionalVideo" type="video/mp4" />
                </video>
                <img src="@/assets/images/placeholder.png" v-else
                  class="w-[500px] h-[300px] object-cover rounded-md shadow" alt="video placeholder" />
              </div>
              <!-- Upload section -->
              <div>


                <span class="block text-sm text-gray-600 mb-2">
                  {{ $t("lan.course_promotion_video_description") }}
                </span>
                <g-upload-files v-model="localCourseInfo.promotionalVideo" repository="PromotionalVideo"
                  source="CourseImage" :course="course" :placeholder="$t('upload_file')" apiName="promotionalVideo"
                  :allow-file="ALLOW_FILE.video"
                  type="Video" @selected="videoDetail" :button-name="$t('upload')"  />
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </template>
  </ItemLayout>
</template>
<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { retrieveDataWithFilter } from "../../firebase/firestore";
import { COLLECTION_NAME,ALLOW_FILE } from "@/utilities/utilityConstant";
import { coursesLandingPage } from "@/services/griot_service";

import GUploadFiles from "@/components/forms/FormElements/GUploadFiles.vue";
import GRichTextEditor from "@/components/forms/FormElements/GRichTextEditor.vue";
import ItemLayout from "./items/ItemLayout.vue";
import BaseInput from "@/components/forms/FormElements/BaseInput.vue";
import BaseSelect from "@/components/forms/FormElements/BaseSelect.vue";
import { emitter } from "@/events/emitter";
import { useToast } from 'vue-toastification'

const toast = useToast();
// Props


const props = defineProps<{
  course: Record<string, any>;
}>();

// Emits
const emits = defineEmits<{
  (e: "refresh"): void;
}>();

const { t } = useI18n();

// State
const localCourseInfo = ref<Partial<Record<string, any>>>({});
const loading = ref(false);
const alert = ref<null | string>(null);
const isSaving = ref(false);
const courseCategory = ref<string>("");
const courseSubCategory = ref<string>('');
const categoriesOptions = ref<Array<Record<string, any>>>([]);
const courseSubCategoryOptions = ref<Array<Record<string, any>>>([]);
const hasError = ref(false);
const languages = ref([
  { value: "French", label: "French" },
  { value: "Italy", label: "Italy" },
  { value: "English", label: "English" },
  { value: "Swahili", label: "Swahili" },
]);

const levels = ref([
  { value: "All level", label: t("All level") },
  { value: "Beginner", label: t("Beginner") },
  { value: "Intermediate", label: t("Intermediate") },
  { value: "Expert", label: t("Expert") },
]);
// Methods
const initInfo = (course: Record<string, any>) => {
  localCourseInfo.value = { ...course };
  courseSubCategory.value = course.subCategory ?? null;
  courseCategory.value = course.categories ?? null;
};

watch(courseCategory, (value) => {
  const cat = categoriesOptions.value.find((e) => e.id === value);
  courseSubCategoryOptions.value = cat?.subItems?.map((e: any) => ({
    value: e.id,
    ...e,
    label: e.title,
  })) || [];
});

const isValidate = (): boolean => {
  const r = localCourseInfo.value;
  return (
    !!r.title &&
    !!r.subTitle &&
    !!r.language &&
    !!r.level &&
    !!courseCategory.value &&
    !!courseSubCategory.value &&
    !!r.description &&
    !!r.picture &&
    r.description.split(/\s+/).length > 200
  );
};

const save = async () => {
  if (!isValidate()) {
    hasError.value = true;
    return;
  }

  hasError.value = false;
  isSaving.value = true;

  const payload = {
    ...localCourseInfo.value,
    categories: courseCategory.value,
    subCategory: courseSubCategory.value,
  };

  try {
    const response = await coursesLandingPage(props.course.id, payload);
    const result = await response.json();
    console.log("result", result);
    toast.success(t("information_save_successfully"));
    emits("refresh");
  } catch (error) {
    toast.error(t("error_occur"));
  } finally {
    isSaving.value = false;
  }
};

const retrieveCategory = async () => {
  try {
    const result = await retrieveDataWithFilter(
      COLLECTION_NAME.categories,
      null,
      null
    );
    const categories = result as Array<Record<string, any>>;
    categoriesOptions.value = categories.map((e: any) => ({
      value: e.id,
      ...e,
      label: e.title,
    }));

    if (localCourseInfo.value.subCategory && localCourseInfo.value.categories) {
      const cat = categoriesOptions.value.find(
        (e) => e.id === localCourseInfo.value.categories
      );
      courseSubCategoryOptions.value = cat?.subItems?.map((e: any) => ({
        value: e.id,
        ...e,
        name: e.title,
      })) || [];
    }
  } catch (error) {
    console.error("error", error);
  }
};

const videoDetail = (value: { downloadURL: string }) => {
  localCourseInfo.value.promotionalVideo = value.downloadURL;
};
onMounted(() => {
  emitter.on("save-course-messages", save);
});
onBeforeUnmount(() => {
  emitter.off("save-course-messages", save);
});
// Initialize
initInfo(props.course);
retrieveCategory();
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
  padding: 12px;
}

.g-input-description {
  font-size: smaller;
}

.g-form-control {
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
