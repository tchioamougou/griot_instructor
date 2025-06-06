<template>
  <div class="g-carousel-container_s" v-if="elements && elements.length >0">
    <div class="g-carousel-content-wrapper">
      <div class="g-carousel-content" :style="{ transform: `translateX(-${sliderPosition}px)` }">
        <div class="g-carousel-item" v-for="(item, index) in elements" :key="index">
          <g-student-item :enrollment="item"/>
        </div>
      </div>
    </div>
    <div class="g-carousel-arrow prev" @click="moveSlider(-1)" v-if="showPrev">
      <i class="bi bi-chevron-left"></i>
    </div>
    <div class="g-carousel-arrow next" @click="moveSlider(1)" v-if="showNext && showNextInit">
      <i class="bi bi-chevron-right"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import GStudentItem from './GStudentItem.vue';

// Define the shape of each element in the `elements` array
interface ElementType {
  // Replace this with actual structure if needed
  [key: string]: any;
}

// Define props with type
const props = defineProps<{
  elements: ElementType[];
}>();

// Reactive state
const items = ref<ElementType[]>([]);
const sliderPosition = ref(0);
const itemWidth = ref(250);
const visibleItems = ref(5);
const showPrev = ref(false);
const showNext = ref(true);

// Computed property for whether to show the next button initially
const showNextInit = computed(() => {
  return props.elements && props.elements.length > visibleItems.value;
});

// Method to move the slider
function moveSlider(direction: number) {
  const maxPosition = (props.elements.length - visibleItems.value) * itemWidth.value;
  let newPosition = sliderPosition.value + direction * itemWidth.value;

  console.log('newPosition', newPosition);
  console.log('maxPosition', maxPosition);

  newPosition = Math.max(0, Math.min(maxPosition, newPosition));
  sliderPosition.value = newPosition;

  console.log('sliderPosition', sliderPosition.value);

  showPrev.value = newPosition > 0;
  showNext.value = newPosition < maxPosition;
}

// Watch for prop changes to update local items
watch(
  () => props.elements,
  (newVal) => {
    items.value = newVal;
    console.log('student', items.value);
  },
  { immediate: true }
);
</script>


<style>
.g-carousel-container_s {
  width: 100%;
  position: relative;
  overflow: visible;
}

.g-carousel-content-wrapper {
  display: flex;
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
}

.g-carousel-content {
  padding: 0.5em 0;
  display: flex;
  transition: transform 0.3s ease-in-out;
  z-index: 1;

}

.g-carousel-item {
  width: 250px;
  margin-right: 20px;
}

.g-carousel-item img {
  max-width: 100%;
}

.g-carousel-arrow {
  width: 40px;
  height: 40px;
  position: absolute;
  top: calc(50% - 20px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
}

.g-carousel-arrow.prev {
  left: -1.5rem;
}

.g-carousel-arrow.next {
  right: -1.5rem;
}

.g-carousel-arrow i {
  color: white;
  font-size: 1.4rem;
  padding: 3em;
}
</style>