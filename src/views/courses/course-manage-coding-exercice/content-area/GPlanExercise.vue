<template>
  <div class="container-lg col-lg-5 mt-4">
    <div class=" ">
      <h1 class="g-heading-serif-md">{{ $t('plan_exercise') }}</h1>
      <p v-html="$t('plan_exercise_ob.description')" class="g-text-md mt-4">
      </p><a href="#" class=" fw-bold">{{ $t('plan_exercise_ob.link') }}</a>
      <g-input :label="$t('plan_exercise_ob.title')" :placeholder="$t('plan_exercise_ob.title_placeholder')" v-model="item.title"/>
      <g-text-area :label="$t('plan_exercise_ob.learning_objective')" :placeholder="$t('plan_exercise_ob.learning_objective_placeholder')" v-model="item.learningObjectives"/>
    </div>
  </div>
</template>
<script setup>

import GInput from "@/resources/GInput.vue";
import GTextArea from "@/resources/GTextArea.vue";
const props = defineProps({
  item:{
    type:Object,
    required:true
  }
})
</script>

<style scoped>
@import url(../../../../assets/css/link.css);

a {
  text-decoration-line: underline;
}
</style>