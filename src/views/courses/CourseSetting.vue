<template>
  <ItemLayout :title="$t('Setting')">
    <template #main>
      <div class="g-container">
        <!-- course Status -->
        <div>
          <p class="text-lg font-bold mb-2">{{ $t('course_status') }}</p>
          <p class="mb-2">
            {{ $t('course_on_status', { status: $t(course.status === "Published" ? "published" : "unpublished") }) }}
          </p>
          <p>
            <span>
              <Button class="g-setting-button" :disabled="course.status !== 'Published'"
                :title="$t('unplublishCourse')">
                {{ $t('unpublished') }}
              </Button>
            </span>
            <span>{{ $t('unpublished_message') }}
            </span>
          </p>
          <p class="mt-2">
            <span>
              <Button class="g-setting-button" @click="confirmAction" :disabled="course.status === 'Published'"
                :title="$t('delete_course')">
                {{ $t('delete') }}
              </Button>
            </span>
            <span>
              {{ $t('course_delete_message') }}
            </span>
          </p>
        </div>
      </div>
    </template>
  </ItemLayout>
  <g-confirmation id="adminCourse" ref="confirmation" @accepted="accepted" :message="$t('delete_course_message')"
    @cancel="refuse" :title="$t('please_confirm')" :accept-label="$t('delete')" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import GConfirmation from "@/components/ui/GConfirmation.vue";
import { deleteCourse } from "@/services/griot_service";
import router from "../../router";
import ItemLayout from "./items/ItemLayout.vue";
import Button from "@/components/ui/Button.vue";

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});
const confirmation = ref<InstanceType<typeof GConfirmation> | null>(null);
const confirmAction = () => {
  confirmation.value?.show();
};
const accepted = () => {
  confirmation.value?.showSpinner();
  deleteCourseLocal();
};
const refuse = () => {
  confirmation.value?.hide();
};
const deleteCourseLocal = () => {
  deleteCourse(props.course.id)
    .then((response) => {
      console.log("deleteCourseLocal", response);
      if (response.status == 200) {
        confirmation.value?.hideSpinner();
        confirmation.value?.hide();
        router.push("/instructor/courses");
      }
    })
    .catch((error) => {
      confirmation.value?.hideSpinner();
      console.log("error", error);
    });
};
</script>

<style scoped>
.g-setting-button {
  padding: 0.25em 0.5em;
  width: 8em;
  margin-right: 1em;
  background-color: darkred;

  color: white;
  font-weight: bold;
  border: none;
}

button.g-setting-button:disabled {
  background-color: rgb(139, 0, 0, 0.2);
}

button.g-setting-button:hover {
  background-color: rgb(139, 0, 0, 0.2);
}
</style>
