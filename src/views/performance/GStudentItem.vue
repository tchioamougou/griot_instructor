<template>
  <div class="g_enrollment_item">
    <div class="image_bloc">
      <button class="avatar-button" id="UserAvatarText" type="button">
        <span class="avatar-text" v-if="!enrollment.ownerId.picture">{{ avatar }}</span>
        <img class="avatar-img" v-else :src="enrollment.ownerId.picture" />
      </button>
    </div>
    <div class="user_name">{{ enrollment.ownerId.name }}</div>
    <div class="user_position"><i class="bi bi-geo-alt-fill"></i> Cameroun</div>
    <div class="course_name"><i class="bi bi-play-circle-fill"></i>{{ enrollment.title }}</div>
    <div class="user_enrolled">Enrolled {{ enDate }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDateT, getFirstAndLastChars } from '@/utilities/UtilityFunction';



const props = defineProps({
  enrollment: {
    type: Object,
    required: true
  }
});

const avatar = computed(() =>
  getFirstAndLastChars(props.enrollment.ownerId.name).toUpperCase()
);

const enDate = computed(() =>
  formatDateT(props.enrollment.createdDate)
);
</script>



<style scoped>
.g_enrollment_item {
  height: 250px;
  border: 0.1em solid rgb(0, 0, 0, 0.3);
  width: 220px;
  text-align: center;
  padding: 1em 0.5em;
  margin: 0 0.5em;
  font-family: sans-serif;
  background-color: rgb(128, 128, 128, 0.01);
  cursor: pointer;
}

.g_enrollment_item:hover {
  background-color: rgb(128, 128, 128, 0.09);

}

.user_name {
  margin: 1.5em 0;
  font-weight: 900;
}

.course_name {
  display: block !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  margin-top: 0.3rem;
  margin-bottom: 0.2em;
  font-weight: 700;
}

.avatar-text {
  font-size: 0.9rem;
  padding: 1rem;
}

.avatar-img {
  border-radius: 50px;
  height: 60px;
}

.user_position {
  text-transform: capitalize;
}

.user_enrolled {
  font-size: 0.91em;
}
</style>