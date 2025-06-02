<template>
  <div class="d-flex">
    <div v-for="it in tabs" @click="selectTab(it)" class="me-5 pb-3 g-tab g-heading-serif-md" ref="tabsRef" :id="it.value">
      {{ $t(it.label) }} <i class="bi bi-check-circle-fill text-success" v-if="it.done"></i>
      <i class="bi bi-exclamation-octagon-fill text-danger" v-if="it.isError"></i>
    </div>
  </div>
</template>
<script setup>
import {ref, watch} from "vue";

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  }
});
const emits = defineEmits(['selectedTab'])
const selectTab = (tab) => {
  setTab(tab.value);
  emits('selectedTab', tab);
}
const tabsRef = ref(null);
const setTab = (value) => {
  tabsRef.value.forEach(e => {
    if (e.id === value) {
      e.classList.add('g-selected');
    } else {
      e.classList.remove('g-selected');
    }
  })
}
defineExpose({setTab})
</script>
<style scoped>
.g-selected {
  border-bottom: solid var(--griot-gray-800) .1em;
  opacity: 1 !important;
}

.g-tab {
  opacity: 0.7;
  font-weight: bold;
  cursor: pointer;
}

.g-tab:hover {
  opacity: 1;
}
</style>