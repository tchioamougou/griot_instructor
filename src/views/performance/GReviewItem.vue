<template>
  <div class="review-item border border-black/25 rounded-md">
    <div class="g-message-item">
      <div class="image_bloc">
        <button class="avatar-button" id="UserAvatarText" type="button">
          <img :src="review.student?.picture" v-if="review.student?.picture" width="40" height="40" class="avatar-img"
            alt="user picture" :title="review.student.name" />
          <!-- <span class="avatar-text" v-else>{{ avatarText }}</span> -->
          <span class="avatar-text" v-else>{{ review.student.name.charAt(0).toUpperCase() }}</span>
        </button>
      </div>
      <div class="message_bloc">
        <div class="message_summary" :title="review.student.name">
          <span class="name text-purple-400">{{ review.student.name }}</span>
          <span class="time">{{ $t('posted') }} {{ getDate(review.createdDate) }}</span>
        </div>
        <div class="course_summary">
          <div class="courseName">
            {{ review.course.title }}
          </div>
          <div class="courseLink text-purple-400 text-sm">{{ $t('view_course_details') }}</div>
        </div>
      </div>
      <div class="icon_bloc">
        <span><span class="item"> <i class="bi bi-flag-fill"></i> </span>
        </span>
      </div>
    </div>
    <div class="review_rating">
      <stars-rating :star-style="styleConfig" :rating="review.rating" /> ({{ review.rating }})
    </div>
    <div class="review_message">{{ review.message }}</div>
    <div class="review_evaluation">
      <div class="row">
        <template v-for="el in evaluations" :key="el.question">
          <div class="col-md-4 col-sm-12 review_evaluation_item">
            <i class="yes bi bi-check-circle-fill" v-if="el.response === 'Yes'"></i>
            <i class="no bi bi-x-circle-fill" v-if="el.response === 'No'"></i>
            <i class="notSure bi bi-question-circle" v-if="el.response === 'NotSure' || !el.response"></i>
            <span>{{ el.question }}</span>
          </div>
        </template>
      </div>
    </div>
    <div class="review_response" v-if="review.instructorResponse">
      <div class="instructor_header">
        <div class="instructor_image">
          <button class="avatar-button" id="UserAvpro" type="button">
            <img :src="review.course?.instructor?.picture" v-if="review.course?.instructor?.picture" width="40"
              height="40" class="avatar-img" />
            <span class="avatar-text" v-else>GU</span>
          </button>
        </div>
        <div class="instructor_content">
          <span class="title">Instructor</span>
          <span class="name">{{ review.course?.instructor.name }}
            <span class="time">{{ review.instructorReplyStatus }} {{ duration }}</span></span>
        </div>
      </div>
      <div class="instructor_message">
        {{ review.instructorResponse }}
      </div>
    </div>
    <div class="review_respond">
      <Button size="sm" v-if="!typing" @click="typing = true">
        <span v-if="review.instructorResponse">{{ $t('edit_response') }}</span>
        <span v-else>{{ $t('respond') }}</span>
      </button>
      <div class="typing" v-if="typing">
        <div class="text">
          <GRichTextEditor placeholder="Respond to the review" v-model="message" />
        </div>
        <div class="flex justify-end gap-3 ">
          <Button  size="sm" :disabled="isSaving || !message" @click="saveResponse">
            <spinner-cmp v-if="isSaving" /> {{ $t('post_resonse') }}
          </button>
          <Button variant="neutral" size="sm" class="cancel" @click="typing = false">{{ $t('Cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import {
  getTimeAgoFromDateTime,
} from "@/utilities/UtilityFunction";
import { reviewReply } from "@/services/griot_service";
import StarsRating from "@/components/ui/RatingStar.vue";
import SpinnerCmp from "@/components/spinner/Spinner.vue";
import Button from "@/components/ui/Button.vue";
import { useI18n } from 'vue-i18n';
import GRichTextEditor from "@/components/forms/FormElements/GRichTextEditor.vue";
const { t } = useI18n();
const props = defineProps({
  reviewObject: {
    type: Object,
    required: true,
  },
});
const review = ref<any>(null);
const typing = ref(false);
const isSaving = ref(false);
const message = ref('');
const styleConfig = {
  fullStarColor: "#ed8a19",
  emptyStarColor: "#737373",
  starWidth: 16,
  starHeight: 16,
};
const evaluations = [
  { question: t("ev1"), response: "" },
  { question: t("ev2"), response: "" },
  { question: t("ev3"), response: "" },
  {
    question:
      t("ev4"),
    response: "",
  },
  {
    question: t("ev5"),
    response: "",
  },
  {
    question: t("ev6"),
    response: "",
  },
];

const duration = computed(() => {
  if (review.value.instructorResponse) {
    return getTimeAgoFromDateTime(review.value.instructorReplyDate);
  }
  return '';
});
const getDate = (dt: string) => {
  return getTimeAgoFromDateTime(dt);
};
const saveResponse = () => {
  isSaving.value = true;
  const request = {
    instructorResponse: message.value
  }
  reviewReply(review.value.id, request).then((response) => {
    return response.json();
  }).then((result) => {
    review.value = result;
    console.log('Data migrations', result);
    isSaving.value = false;
    typing.value = false;
  }).catch((error) => {
    console.log('Data migrations error', error);
    isSaving.value = false;
  })
};

/** start**/
review.value = props.reviewObject;
message.value = props.reviewObject.instructorResponse;
evaluations[0].response = review.value.evaluations_0;
evaluations[1].response = review.value.evaluations_1;
evaluations[2].response = review.value.evaluations_2;
evaluations[3].response = review.value.evaluations_3;
evaluations[4].response = review.value.evaluations_4;
evaluations[5].response = review.value.evaluations_5;

</script>

<style scoped>
.review-item {
  padding: 1em 2em;
  margin: 2.5em 0;
  font-family: sans-serif;
}

.g-message-item {
  padding: 1em 0;
  padding-right: 1.2em;
  display: flex;
  flex-direction: row;
  cursor: pointer;
}

.g-message-item .image_bloc {
  margin-right: 0.2em;
}

.g-message-item .message_bloc {
  margin: 0 0.5em;
  width: 80%;
}

.message_bloc .message_summary {
  font-weight: 400;
  font-family: sans-serif;
  font-size: 0.9em;
  margin-bottom: 0.5em;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis;
  width: 95%;
  cursor: pointer;
}

.message_bloc .message_summary .name {
  font-weight: 900;
  font-size: 0.95em;
  cursor: pointer;
  text-transform: capitalize;
}

.message_bloc .message_details .time {
  font-weight: 400;
  font-size: 0.8em;
}

.g-message-item .icon_bloc {
  display: flex;
  flex-direction: column;
  width: 10%;
}

.icon_bloc .item {
  float: right;
  cursor: pointer;
  font-family: sans-serif;
  font-size: 1.2em;
}

.review_rating {
  display: flex;
  justify-content: left;
}

.review_message {
  margin: 1em 0;
  font-family: sans-serif;
}

.review_evaluation_item {
  margin: 0.5em 0;
  font-family: sans-serif;
  font-size: 0.9em;
}

.review_evaluation_item i {
  margin-right: 0.5em;
}

.review_evaluation_item i.yes {
  color: green;
}

.review_evaluation_item i.no {
  color: red;
}

.course_summary {
  display: flex;
  margin-bottom: 0.1em;
}

.course_summary .courseName {
  color: #8585d7;
  font-size: 0.95em;
  font-family: sans-serif;
  margin-right: 1em;
}

.course_summary .courseLink {
  font-weight: 700;
  cursor: pointer;
}

.typing {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: sans-serif;
  margin: 1em 0;
}

.typing textarea {
  width: 100%;
  min-height: 5em;
  padding: 1em;
}

.typing .cancel {
  text-transform: capitalize;
  margin-left: 1em;
  outline: none;
  border: none;
  background-color: transparent;
  font-weight: 700;
}

.typing .post {
  padding: 0.25em 1em;
  text-transform: capitalize;
  font-weight: 700;
  font-size: 0.9em;
  color: white;
  background-color: var(--g-c-blue-dark);
}

button.post:disabled {
  background-color: gray;
}

.typing .action {
  margin: 0.5em;
}



.time {
  color: gray;
  font-size: small;
  margin-left: 0.5em;
}

.review_response {
  display: flex;
  flex-direction: column;
  margin: 1em 0;
}

.review_response .instructor_header {
  display: flex;
  flex-direction: row;
  margin: 0.5em 0;
}

.instructor_content {
  display: flex;
  flex-direction: column;
}

.avatar-text {
  align-items: center;
  color: #fff;
  display: block;
  background-color: var(--g-c-blue-dark);
  font-size: 0.8rem;
  border-radius: 50%;
  justify-content: center;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 5px;
   padding-bottom: 5px;
}
</style>
