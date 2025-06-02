<template>
  <div class="g-accordion mt-2 mb-5">
    <div v-if="isPracticeTest">
      <div class="g-accordion-item">
        <div class="g-accordion-el">
          <div
            v-for="(pratice, index) in records"
            :key="index"
            class="mt-3"
            :data-id="pratice.id"
            @click="selectedPractice(pratice)"
          >
            <div class="g-lecture-item" ref="lecturesRef" :id="pratice.id">
              <div class="g-lecture-item-checkbox">
                <input
                  type="checkbox"
                  :name="pratice.id"
                  disabled
                  :checked="pratice.status === 'Finish'"
                />
              </div>
              <div class="g-lecture-item-title">
                <div class="ps-2 lessonsTitle">
                  <div>{{ pratice.practiceTest.title }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="g-accordion-item"
      v-for="(section, i) in sections"
      :key="section.id"
    >
      <div class="g-accordion-item-header" @click="toggleItem(i)">
        <div class="g-accordion-item-header-title">
          <div class="">
            {{ $t('section') }} {{ section.session.position }}: {{ section.session.title }}
          </div>
          <div class="g-section-item-tile">
            {{ section.lectureProgressions.filter(e=>e.status==="Finish")?.length }} /
            {{ section.lectureProgressions.length }} |
            {{ Math.floor(section.session.totalDurations / 60) }} min
          </div>
        </div>
        <span class="g-accordion-item-header-icon"
          ><i class="bi bi-chevron-down" v-if="!section.active"></i>
          <i class="bi bi-chevron-up" v-else></i
        ></span>
      </div>
      <div class="g-accordion-el" v-if="section.active">
        <div
          v-for="(lecture, index) in section.lectureProgressions"
          :key="index"
          class="mt-3"
          :data-id="section.id"
          @click="selectedLecture(lecture)"
        >
          <div class="g-lecture-item" ref="lecturesRef" :id="lecture.id">
            <div class="g-lecture-item-checkbox">
              <input
                type="checkbox"
                :value="lecture.id"
                :name="lecture.id"
                disabled
                :checked="lecture.status === 'Finish'"
              />
            </div>
            <div class="g-lecture-item-title">
              <div class="ps-2 lessonsTitle">
                <div>
                  {{ lecture.lecture.position }}.{{ lecture.lecture.title }}
                </div>
                <div class="g-lecture-item-tile">
                  <span>
                    <i
                      class="bi bi-play-btn-fill me-1"
                      v-if="lecture.lecture.documentType === 'Video'"
                    ></i>
                    <i
                      class="bi bi-file-richtext-fill me-1"
                      v-if="lecture.lecture.documentType === 'Article'"
                    ></i
                    >{{
                      lecture.lecture.duration
                        ? Math.floor(lecture.lecture.duration / 60)
                        : 0
                    }}min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import router from "../../router";
const lecturesRef = ref(null);
const emits = defineEmits(["selectedLecture", "selectedPractice"]);
const props = defineProps({
  records: {
    type: Array,
    required: true,
  },
  isPracticeTest: {
    type: Boolean,
  },
});
const currentItem = ref(null);
const sections = ref([]);
const practices = ref([]);
const getParameters = () => {
  const query = router.currentRoute.value.query;
  if (query.practice) {
    currentItem.value = query.practice;
  }
};
const toggleItem = (index) => {
  let itemsLocal = sections.value;
  itemsLocal[index].active = !itemsLocal[index].active;
  sections.value = [...itemsLocal];
};
const selectedLecture = (lecture) => {
  if (lecture.id !== currentItem.value) {
    currentItem.value = lecture.id;
    lecturesRef.value.forEach((e) => {
      if (e.id == lecture.id) e.classList.add("g-active-item");
      else e.classList.remove("g-active-item");
    });
    emits("selectedLecture", lecture);
  }
};
const selectedPractice = (practice)=>{
  if (practice.id !== currentItem.value) {
    currentItem.value = practice.id;
    lecturesRef.value.forEach((e) => {
      if (e.id == practice.id) e.classList.add("g-active-item");
      else e.classList.remove("g-active-item");
    });
    emits("selectedPractice", practice);
  }
}
const setLectureColor =(lecture)=> {
  if (lecture.id !== currentItem.value) {
    currentItem.value = lecture.id;
    lecturesRef.value.forEach((e) => {
      if (e.id == lecture.id) e.classList.add("g-active-item");
      else e.classList.remove("g-active-item");
    });
  }
};
onMounted(() => {
  if (!props.isPracticeTest) {
    sections.value = props.records?.sort((a,b)=>(a.session.position > b.session.position) ? 1 : ((b.session.position > a.session.position) ? -1 : 0));
}});
</script>

<style scoped>
/** */
.g-accordion {
}
.g-accordion-item {
  border-top: 0.000000001em solid gray;
}

.g-accordion-item-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1em 1.3rem;
  background-color: hsl(198, 24%, 42%, 0.05);
}
.g-accordion-item-header-title {
  font-weight: 900;
  font-family: sans-serif;
  font-size: 0.9em;
  margin-right: 0.2em;
}

.g-accordion-item-header .g-section-item-tile {
  font-size: 0.7em;
  font-weight: 10;
  margin-top: 0.5em;
  font-family: "Arial Narrow";
}
.g-accordion-item-header-icon {
}
.content-header {
  font-weight: 900;
  font-family: sans-serif;
  font-size: 1em;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1em;
  padding: 0px 1.3rem;
}

.g-accordion-el {
  line-height: 26px;
  font-family: sans-serif;
  font-size: 1.1em;
}
.g-section-item {
  padding: 0.3em;
}

.g-lecture-item {
  cursor: pointer;
  width: 100%;
  font-size: 0.9em;
  padding: 0.3em 1.3rem;
  display: flex;
}
.g-lecture-item:hover {
  background-color: hsl(198, 24%, 42%, 0.3);
}
.g-header-text {
  font-size: 1em;
  cursor: pointer;
  font-family: sans-serif;
  font-stretch: extra-expanded;
  font-size: 1em;
}
.g-active-item {
  background-color: hsl(198, 24%, 42%, 0.3) !important;
}
input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 3px solid #0a0809;
  border-radius: 0px;
  width: 16px;
  height: 16px;
  outline: none;
  position: relative;
  transition: border-color 0.3s ease-in-out;
}

input[type="checkbox"]:checked:before {
  content: "\2713";
  width: 16px;
  height: 16px;
  background-color: black;
  position: absolute;
  color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-bottom: 0px;
  display: block;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
}

input[type="checkbox"]:focus {
  border-color: blue;
}

input[type="checkbox"]:checked:focus {
}

input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 1;
}
.g-lecture-item-checkbox {
}
.g-lecture-item-title {
  transform: scale(1, 1.1);
  /*letter-spacing: 2px;*/
}
.g-lecture-item-tile {
  font-size: small !important;
  font-weight: 10 !important;
  font-family: "Arial Narrow" !important;
}
</style>
