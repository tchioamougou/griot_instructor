<template>
  <div class="card g-box-shadow">
    <div class="card-body">
      <h5 class="g-title g-header">{{ $t('Setting') }}</h5>
      <div class="g-container">
        <!-- course Status -->
        <div>
          <p class="h2">{{$t('course_status')}}</p>
          <p>
            {{ $t('course_on_status',{status:$t(course.status === "Published" ? "published" : "unpublished")}) }}
          </p>
          <p>
            <span>
              <button class="g-setting-button"
                :disabled="course.status !== 'Published'"
                :title="$t('unplublishCourse')"
              >
                {{ $t('unpublished') }}
              </button>
            </span>
            <span
              >{{$t('unpublished_message')}}
            </span>
          </p>
          <p>
            <span>
              <button class="g-setting-button"
                @click="confirmAction"
                :disabled="course.status === 'Published'"
                :title="$t('delete_course')"
              >
                {{ $t('delete') }}
              </button>
            </span>
            <span>
              {{ $t('course_delete_message') }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
  <g-toast ref="message" :duration="5000" direction="top-center" />
  <g-confirmation
    id="adminCourse"
    ref="confirmation"
    @accepted="accepted"
    :message="$t('delete_course_message')"
    @cancel="refuse"
    :title="$t('please_confirm')"
    :accept-label="$t('delete')"
  />
</template>
<script setup>
import { ref } from "vue";
import GConfirmation from "../../resources/GConfirmation.vue";
import { deleteCourse } from "../../database/griot";
import router from "../../router";

const props = defineProps({
  course: {
    type: String,
    required: true,
  },
});
const message = ref(null);
const confirmation = ref(null);
const confirmAction = () => {
  confirmation.value.show();
};
const accepted = () => {
  confirmation.value.showSpinner();
  deleteCourseLocal();
};
const refuse = () => {
  confirmation.value.hide();
};
const deleteCourseLocal = () => {
  deleteCourse(props.course.id)
    .then((response) => {
      console.log("deleteCourseLocal", response);
      if (response.status == 200) {
        confirmation.value.hideSpinner();
        confirmation.value.hide();
        router.push("/instructor/courses");
      }
    })
    .catch((error) => {
      confirmation.value.hideSpinner();
      console.log("error", error);
    });
};
</script>

<style scoped>
.g-setting-button{
 padding: 0.25em 0.5em;
  width: 8em;
  margin-right: 1em;
  background-color: darkred;

color: white;
  font-weight: bold;
  border: none;
}
button.g-setting-button:disabled{
  background-color: rgb(139, 0, 0,0.2);
}
button.g-setting-button:hover{
  background-color: rgb(139, 0, 0,0.2);
}
</style>
