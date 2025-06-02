<template>
  <div class="card g-box-shadow">
    <div class="card-body">
      <div class="g-block-header">
        <div class="block_title">
          <h5 class="g-title">{{ $t("CourseLandingPage") }}</h5>
        </div>
      </div>
      <h5 class="g-title"></h5>
      <template v-if="loading">
        <g-spinner />
      </template>
      <template v-if="!loading">
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

          <div v-if="hasError" class="text-danger mt-2 g-text-bold">
            {{ $t("lan.required_field_message") }}
          </div>
          <!--  Course Title-->
          <g-input v-model="localCourseInfo.title" type="text" :placeholder="$t('lan.course_title_place_holder')"
            :label="$t('lan.course_title')" show-rest :max="80" show-description required
            :is-error="hasError && !localCourseInfo.title" :description="$t('lan.course_title_description')" />
          <!-- Course subTitle-->
          <g-input v-model="localCourseInfo.subTitle" type="text" :placeholder="$t('lan.course_subtitle_place_holder')"
            :label="$t('lan.course_subtitle')" show-rest :max="200" required show-description
            :is-error="hasError && !localCourseInfo.subTitle" :description="$t('lan.course_subtitle_description')" />
          <!-- Course Language -->
          <div class="g-form-group">
            <label class="g-input-label">{{ $t("Language") }}</label>
            <select class="g-form-control" v-model="localCourseInfo.language" required>
              <option value="French">French</option>
              <option value="Italy">Italy</option>
              <option value="English">English</option>
              <option value="Swahili">Swahili</option>
            </select>
            <span class="g-input-description">{{
              $t("lan.course_language_description")
            }}</span>
          </div>
          <!-- TODO Implement course level here-->
          <div class="g-form-group">
            <label class="g-input-label">{{ $t("lan.course_level") }}</label>
            <select class="g-form-control" v-model="localCourseInfo.level">
              <option value="All level">{{ $t("All level") }}</option>
              <option value="Beginner">{{ $t("Beginner") }}</option>
              <option value="Intermediate">{{ $t("Intermediate") }}</option>
              <option value="Expert">{{ $t("Expert") }}</option>
            </select>
          </div>
          <g-select :options="categoriesOptions" v-model="courseCategory" :label="$t('category')" />
          <g-select :options="courseSubCategoryOptions" v-model="courseSubCategory" v-if="courseCategory"
            :label="$t('subCatgory')" />
          <!-- Course Description-->
          <div class="mt-4">
            <g-rich-text-editor v-model="localCourseInfo.description" :content="localCourseInfo.description"
              :label="$t('lan.course_description')" :description="$t('lan.course_description_des')" :min="2000"
              :max="5000" :show-image="true" />
          </div>
          <!--Course image-->
          <div class="mt-4 mb-5">
            <label class="form-label g-input-label">{{
              $t("lan.course_image")
            }}</label>
            <div class="row">
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <span>{{ $t("lan.course_image_description") }}</span>
                <div class="mb-3">
                  <g-upload-files v-model="localCourseInfo.picture" repository="CourseImages" source="CourseImage"
                    :course="course" :placeholder="$t('upload_file')" apiName="courseImage" type="Image" />
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 g-center">
                <img :src="localCourseInfo.picture" height="200" width="250" alt="course image" title="course image" />
              </div>
            </div>
          </div>
          <!--Promotional video-->
          <div class="mt-2 mb-5">
            <label class="form-label g-input-label">{{
              $t("lan.course_promotion_video")
            }}</label>
            <div class="row">
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <span class="pb-2">{{ $t("lan.course_promotion_video_description") }}
                </span>
                <div class="mb-3">
                  <g-upload-files v-model="localCourseInfo.promotionalVideo" repository="PromotionalVideo"
                    source="CourseImage" :course="course" :placeholder="$t('upload_file')" apiName="promotionalVideo"
                    type="Video" @selected="videoDetail" />
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 g-center">
                <video width="300" height="200" controls>
                  <source :src="localCourseInfo.promotionalVideo" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
          <!-- Save button -->
          <div class="row justify-content-center">
            <button class="g-button col-xl-2 col-lg-2 col-md-2 col-sm-6" @click="save()" :disabled="isSaving"
              :title="$t('save')">
              <spinner-cmp v-if="isSaving" />
              {{ $t("save") }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
  <g-toast ref="alert" :duration="5000" direction="top-center" />
</template>
<script setup>
import GInput from "../../resources/GInput.vue";
import { retrieveDataWithFilter } from "../../firebase/firestore";
import GUploadFiles from "../../resources/GUploadFiles.vue";
import GSpinner from "../../resources/GSpinner.vue";
import GRichTextEditor from "../../resources/GRichTextEditor.vue";
import GToast from "../../resources/GToast.vue";
import SpinnerCmp from "../../resources/Spinner.vue";
import GSelect from "../../resources/GSelect.vue";
import { COLLECTION_NAME } from "../../resources/utilityConstant";
import { coursesLandingPage } from "../../database/griot";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["refresh"]);
const localCourseInfo = ref({});
const loading = ref(false);
const alert = ref(null);
const isSaving = ref(false);
const courseCategory = ref(null);
const courseSubCategory = ref(null);
const categoriesOptions = ref([]);
const courseSubCategoryOptions = ref([]);
const hasError = ref(false);
const initInfo = (course) => {
  localCourseInfo.value = course;
  courseSubCategory.value = course.subCategory;
  courseCategory.value = course.categories;
};
watch(
  () => courseCategory.value,
  (value) => {
    const cat = categoriesOptions.value.filter((e) => e.id === value)[0];
    courseSubCategoryOptions.value = cat?.subItems?.map((e) => {
      return { value: e.id, ...e, name: e.title };
    });
  }
);
const isValidate = () => {
  const r = localCourseInfo.value;
  return (
    r.title &&
    r.subTitle &&
    r.language &&
    r.level &&
    courseCategory.value &&
    courseSubCategory.value &&
    r.description &&
    r.picture &&
    r.description.split(/\s+/).length > 200
  );
};
const save = () => {
  if (!isValidate()) {
    hasError.value = true;
    return;
  }
  hasError.value = false;
  isSaving.value = true;
  localCourseInfo.value = {
    ...localCourseInfo.value,
    categories: courseCategory.value,
    subCategory: courseSubCategory.value,
  };
  coursesLandingPage(props.course.id, localCourseInfo.value)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      console.log("result", result);
      alert.value.toast(t("CourseLandingPage"), t('information_save_successfully'), "success");
      emits("refresh");
    })
    .catch((e) => {
      alert.value.toast(t('CourseLandingPage'), t('error_occur'), "error");
    })
    .finally(() => {
      isSaving.value = false;
    });
};
// this function is used to retrieve category
const retrieveCategory = async () => {
  await retrieveDataWithFilter(COLLECTION_NAME.categories, null, null)
    .then((result) => {
      console.log(result);
      categoriesOptions.value = result.map((e) => {
        return { value: e.id, ...e, name: e.title };
      });
      if (localCourseInfo.value.subCategory) {
        if (localCourseInfo.value.categories) {
          const cat = categoriesOptions.value.filter(
            (e) => e.id === localCourseInfo.value.categories
          )[0];
          courseSubCategoryOptions.value = cat?.subItems?.map((e) => {
            return { value: e.id, ...e, name: e.title };
          });
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};
const videoDetail = (value) => {
  localCourseInfo.value.promotionalVideo = value.downloadURL;
};

//start here
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
