<template>
  <ItemLayout :title="$t('struc.title')">
    <template #main>
      <div class="g-container text-sm">
        <div>
          <h2>{{ $t("struc.h2_1") }}</h2>
          <p class="mt-2 mb-5">
            {{ $t("struc.p_1") }}
          </p>
        </div>
        <div>
          <h2>{{ $t("struc.h2_2") }}</h2>
          <p class="mt-2 mb-5">
            {{ $t("struc.p_2") }}
          </p>
        </div>
        <div>
          <h2>{{ $t("struc.h2_3") }}</h2>
          <p class="mt-2 mb-5">
            {{ $t("struc.p_3") }}
          </p>
        </div>
        <div>
          <h2>{{ $t("struc.h2_4") }}</h2>
          <p class="mt-2 mb-5">
            {{ $t("struc.p_4") }}
          </p>
        </div>
        <div>
          <h2>{{ $t("struc.h2_5") }}</h2>
          <p class="mt-2 mb-5">
            {{ $t("struc.p_5") }}
          </p>
        </div>
        <div>
          <h2>{{ $t("struc.h2_6") }}</h2>
          <p class="mt-2 mb-5">
            {{ $t("struc.p_6") }}
          </p>
        </div>
        <div>
          <h2>{{ $t("struc.h2_7") }}</h2>
          <p class="mt-2 mb-5">
            {{ $t("struc.p_7") }}
          </p>
        </div>
        <div>
          <h2>{{ $t("struc.h2_8") }}</h2>
          <p class="mt-2 mb-5">
            {{ $t("struc.p_8") }}
          </p>
        </div>
      </div>
    </template>
  </ItemLayout>
</template>
<script setup lang="ts">
import { coursesStep } from "@/services/griot_service";
import ItemLayout from "./items/ItemLayout.vue";
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["refresh"]);
if (!props.course.courseStructureStep) {
  coursesStep(props.course.id, "CourseStructure")
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      emits("refresh");
    })
    .catch((error) => {
      console.log("error==>coursesStep", error);
    });
}
</script>

<style scoped>
.g-container {
  margin-top: 2em;
}

p {
  line-height: 1.5;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
  margin-top: 2rem;
}
</style>
