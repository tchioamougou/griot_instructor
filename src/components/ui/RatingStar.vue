<template>
  <div class="star-rating" :aria-label="localRating + ' of 5'">
    <div v-if="isIndicatorActive" class="indicator">{{ localRating }}</div>
    <div v-for="(star, index) in stars" :key="index" class="star-container">
      <svg
        class="star-svg"
        :style="[
          { fill: `url(#gradient${star.raw})` },
          { width: styleStarWidth },
          { height: styleStarHeight },
        ]"
        @mouseover="starOver($event,index)"
      >
        <polygon :points="getStarPoints" style="fill-rule: nonzero" />
        <defs>
          <!--
					  id has to be unique to each star fullness(dynamic offset) - it indicates fullness above
					-->
          <linearGradient :id="`gradient${star.raw}`">
            <stop
              id="stop1"
              :offset="star.percent"
              stop-opacity="1"
              :stop-color="getFullFillColor(star)"
            ></stop>
            <stop
              id="stop2"
              :offset="star.percent"
              stop-opacity="0"
              :stop-color="getFullFillColor(star)"
            ></stop>
            <stop
              id="stop3"
              :offset="star.percent"
              stop-opacity="1"
              :stop-color="styleEmptyStarColor"
            ></stop>
            <stop
              id="stop4"
              offset="100%"
              stop-opacity="1"
              :stop-color="styleEmptyStarColor"
            ></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="rating_number">
      <slot name="message"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { round } from '@/utilities/UtilityFunction';

interface Star {
  raw: number;
  percent: string;
}

const props = defineProps<{
  rating?: number;
  starStyle?: Record<string, any>;
  isIndicatorActive?: boolean;
  isEditable?: boolean;
}>();

const emit = defineEmits<{
  (e: 'rateChange', rating: number): void;
}>();

// Defaults
const totalStars = 5;
const emptyStar = 0;
const fullStar = 1;

const stars = ref<Star[]>([]);
const localRating = ref(props.rating ?? 4.3);

// Style defaults
const styleStarWidth = ref(50);
const styleStarHeight = ref(50);
const styleEmptyStarColor = ref('#737373');
const styleFullStarColor = ref('#ed8a19');

// Star shape generation
const getStarPoints = computed(() => {
  const centerX = styleStarWidth.value / 2;
  const centerY = styleStarWidth.value / 2;
  const innerCircleArms = 5;
  const innerRadius = styleStarWidth.value / innerCircleArms;
  const outerRadius = innerRadius * 2.5;
  const angle = Math.PI / innerCircleArms;
  const angleOffsetToCenterStar = 60;

  let points = '';
  for (let i = 0; i < innerCircleArms * 2; i++) {
    const isEvenIndex = i % 2 === 0;
    const r = isEvenIndex ? outerRadius : innerRadius;
    const currX = centerX + Math.cos(i * angle + angleOffsetToCenterStar) * r;
    const currY = centerY + Math.sin(i * angle + angleOffsetToCenterStar) * r;
    points += `${currX},${currY} `;
  }
  return points.trim();
});

// Color logic
function getFullFillColor(star: Star): string {
  return star.raw !== emptyStar
    ? styleFullStarColor.value
    : styleEmptyStarColor.value;
}

function calcStarFullness(star: Star): string {
  return `${star.raw * 100}%`;
}

// Star setup
function initStars(): void {
  for (let i = 0; i < totalStars; i++) {
    stars.value.push({
      raw: emptyStar,
      percent: `${emptyStar}%`,
    });
  }
}

function setStars(): void {
  let fullStarsCounter = Math.floor(localRating.value);
  for (let i = 0; i < stars.value.length; i++) {
    if (fullStarsCounter !== 0) {
      stars.value[i].raw = fullStar;
      stars.value[i].percent = calcStarFullness(stars.value[i]);
      fullStarsCounter--;
    } else {
      const surplus = Math.round((localRating.value % 1) * 10) / 10;
      const roundedOneDecimalPoint = Math.round(surplus * 10) / 10;
      stars.value[i].raw = roundedOneDecimalPoint;
      stars.value[i].percent = calcStarFullness(stars.value[i]);
      break;
    }
  }
}

// Apply style overrides
function setNestedConfigStyles(obj: Record<string, any>) {
  for (const key in obj) {
    const newKey = 'style' + key.charAt(0).toUpperCase() + key.slice(1);
    switch (newKey) {
      case 'styleStarWidth':
        styleStarWidth.value = obj[key];
        break;
      case 'styleStarHeight':
        styleStarHeight.value = obj[key];
        break;
      case 'styleEmptyStarColor':
        styleEmptyStarColor.value = obj[key];
        break;
      case 'styleFullStarColor':
        styleFullStarColor.value = obj[key];
        break;
    }
  }
}

// Mouse hover handler for rating
function starOver(event: MouseEvent, index: number): void {
  if (props.isEditable) {
    const element = event.target as HTMLElement;
    const bounding = element.getBoundingClientRect();
    const distanceFromLeft = event.clientX - bounding.left;
    const starLength = bounding.right - bounding.left;
    const percentage = distanceFromLeft / starLength;

    localRating.value = round(index + percentage, 1);
    emit('rateChange', localRating.value);
    evaluate();
  }
}

// Re-render stars
function evaluate(): void {
  stars.value = [];
  if (props.starStyle) {
    setNestedConfigStyles(props.starStyle);
  }
  initStars();
  setStars();
}

// Initial setup
onMounted(() => {
  localRating.value = props.rating ?? 4.3;
  evaluate();
});
</script>


<style scoped>
.star-rating {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.star-rating .star-container {
  display: flex;
  margin-top: 0.2em;
}
.star-rating .star-container:not(:last-child) {
  margin-right: 5px;
}
.indicator{
  color: #7a2f11;
  font-weight: 900;
  margin-right: 0.5em;
}
.star-svg:hover{
}
.rating_number{
  color: gray;
  font-family: sans-serif;
}
</style>
