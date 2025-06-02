<template>
  <div class="card g-box-shadow">
    <div class="card-body">
      <div class="g-block-header">
        <div class="block_title">
          <h5 class="g-title">{{ $t('it.title') }}</h5>
        </div>
      </div>
      <template v-if="loading">
        <g-spinner />
      </template>
      <template v-if="!loading">
        <div class="g-container">
          <div class="g-tip">
            <div class="title important">
              <i class="bi bi-patch-exclamation-fill"></i> {{ $t('important') }}
            </div>
            <div class="list">
              <ul>
                <li>
                  {{ $t('it.tip_1') }}
                </li>
                <li>
                  {{ $t('it.tip_12') }}
                </li>
              </ul>
            </div>
          </div>
          <!-- define what student with learn during the courses-->
          <div class="g-intented-item">
            <div class="mb-2 g-intented-item_title">
              <span>{{ $t('it.what_you_ll_learn') }}</span>
            </div>
            <div class="mb-2 g-intented-item_description">
              <span class="mb-2">{{ $t('it.what_you_ll_learn_description') }}</span>
            </div>
            <div class="input-group mt-2" v-for="lo in learningObjectives" :key="lo.name"
              @mouseover="onHoverLearningObjectivesElement(lo)" @mouseleave="onLeaveLearningObjectivesElement(lo)">
              <input type="text" class="form-control" :placeholder="$t('it.what_you_ll_learn_placeholder')"
                aria-label="Example: Identify and manage project risks" v-model="lo.value" />
              <button class="btn btn-outline-secondary" type="button" v-if="lo.showButton"
                @click="removeLearningObjectives(lo)">
                <i class="bi bi-trash3"></i>
              </button>
              <button class="btn btn-outline-secondary" type="button" v-if="lo.showButton">
                <i class="bi bi-text-center"></i>
              </button>
            </div>
            <div class="">
              <div class="g-add-more-button" @click="addLearningObjectives()">
                <span> +</span>
              </div>
            </div>
          </div>

          <!--What are the requirements or prerequisites for taking your course? -->
          <div class="g-intented-item">
            <div class="mb-1 g-intented-item_title">
              <span>
                <strong>
                  {{ $t('it.what_required') }}
                </strong></span>
            </div>
            <div class="mb-2 g-intented-item_description">
              <span class="mb-2">{{ $t('it.what_required_description') }}</span>
            </div>
            <div class="input-group mt-2" v-for="req in requirements" :key="req.name"
              @mouseover="onHoverRequirementElement(req)" @mouseleave="onLeaveRequirementElement(req)">
              <input type="text" class="form-control" :placeholder="$t('it.what_required_placeholder')"
                aria-label="goal" v-model="req.value" />
              <button class="btn btn-outline-secondary" type="button" v-if="req.showButton"
                @click="removeRequirement(req)">
                <i class="bi bi-trash3"></i>
              </button>
              <button class="btn btn-outline-secondary" type="button" v-if="req.showButton">
                <i class="bi bi-text-center"></i>
              </button>
            </div>
            <div class="">
              <div class="g-add-more-button" @click="addRequirements()">
                <span>+</span>
              </div>
            </div>
          </div>
          <!-- Who is this course for? -->
          <div class="g-intented-item">
            <div class="mb-1 g-intented-item_title">
              <span> <strong>{{ $t('it.who') }}</strong></span>
            </div>
            <div class="mb-2 g-intented-item_description">
              <span class="mb-2">{{ $t('it.who_description') }}</span>
            </div>
            <div class="input-group mb-2" v-for="cf in courseFor" :key="cf.name"
              @mouseover="onHoverCourseForElement(cf)" @mouseleave="onLeaveCourseForElement(cf)">
              <input type="text" class="form-control" :placeholder="$t('it.who_placeholder')" aria-label="goal"
                v-model="cf.value" />
              <button class="btn btn-outline-secondary" type="button" v-if="cf.showButton" @click="removeCourseFor(cf)">
                <i class="bi bi-trash3"></i>
              </button>
              <button class="btn btn-outline-secondary" type="button" v-if="cf.showButton">
                <i class="bi bi-text-center"></i>
              </button>
            </div>
            <div class="">
              <div class="g-add-more-button" @click="addCourseFor()">
                <span>+</span>
              </div>
            </div>
          </div>
          <!-- topics course -->
          <div class="topic">
            <div class="mb-2 g-intented-item_title">
              <span>{{ $t('it.topic') }}</span>
            </div>
            <div class="mb-2 g-intented-item_description">
              <span class="mb-2">{{ $t('it.topic_description') }}</span>
            </div>
            <div class="skills">
              <span class="nb">{{ $t('it.topic_nb') }}</span>
              <div class="skills_value">
                <template v-for="skill in topics" :key="skill.id">
                  <button :class="'target ' + (skill.selected ? ' target_selected' : '')
                    " @click="selectedSkills(skill)">
                    <span class="icon">
                      <i class="bi bi-check-lg" v-if="skill.selected"></i>
                      <i class="bi bi-plus" v-else></i>
                    </span>
                    <span>{{ skill.title }}</span>
                  </button>
                </template>
                <template v-if="loadingTopics">
                  <spinner-cmp color="text-black" />
                </template>
              </div>
            </div>
          </div>
          <!-- button Save -->
          <div>
            <button type="submit" class="g-button" @click="updateCourse()" :disabled="isSaving">
              <spinner-cmp v-if="isSaving" />
              {{ $t('save') }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
  <g-toast ref="message" :duration="10000" direction="top-right" />
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import SpinnerCmp from '@/components/spinner/Spinner.vue';

import {
  COLLECTION_NAME,
  IN_LEARN_NUMBER,
} from '@/utilities/utilityConstant';
import { getDocsWithPaginationInfo } from '@/firebase/firestore';
import { coursesIntendedLearners } from '@/services/griot_service';

interface Item {
  name: string;
  value: string;
  order: number;
  id?: string;
  showButton?: boolean;
}

interface Topic {
  id: string;
  name?: string;
  selected: boolean;
  [key: string]: any;
}

interface Course {
  id: string;
  requirements?: Item[];
  objectives?: Item[];
  courseFor?: Item[];
  topics?: string;
  categories?: string;
  subCategory?: string;
}

const props = defineProps<{
  course: Course;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const { t } = useI18n();

const requirements = ref<Item[]>([{ name: 'requirement_0', value: '', order: 0 }]);
const learningObjectives = ref<Item[]>([{ name: 'leaObject_0', value: '', order: 0 }]);
const courseFor = ref<Item[]>([{ name: 'courseFor_0', value: '', order: 0 }]);

const loading = ref(true);
const isSaving = ref(false);
const alert = ref<any>(null);

const topics = ref<Topic[]>([]);
const category = ref<string | null>(null);
const subcategory = ref<string | null>(null);
const loadingTopics = ref(false);

const addItem = (list: typeof requirements | typeof learningObjectives | typeof courseFor, prefix: string) => {
  if (list.value[list.value.length - 1].value) {
    list.value.push({
      name: `${prefix}_${list.value.length}`,
      value: '',
      order: list.value.length,
      showButton: false,
    });
  }
};

const removeItem = (list: typeof requirements | typeof learningObjectives | typeof courseFor, item: Item, prefix: string) => {
  list.value = list.value.filter((e) => e.name !== item.name);
  list.value.forEach((e) => {
    if (e.order > item.order) {
      e.order--;
      e.name = `${prefix}_${e.order}`;
    }
  });
};

const onHoverElement = (item: Item, list: Item[]) => {
  if (
    parseInt(item.order.toString()) + 1 < list.length ||
    (parseInt(item.order.toString()) + 1 === list.length && item.value)
  ) {
    item.showButton = true;
  }
};

const onLeaveElement = (item: Item) => {
  item.showButton = false;
};

const selectedSkills = (s: Topic) => {
  s.selected = !s.selected;
};

const getTopics = () => {
  loadingTopics.value = true;
  const filter: any[] = [];

  if (category.value) {
    filter.push({ field: 'catId', operator: '==', value: category.value });
  }
  if (subcategory.value) {
    filter.push({ field: 'subCatId', operator: '==', value: subcategory.value });
  }

  getDocsWithPaginationInfo(COLLECTION_NAME.topics, filter, null, 100, null)
    .then((result) => {
      topics.value = result.docs.map((e: any) => ({
        ...e,
        selected: props.course.topics?.includes(e.id),
      }));
      loadingTopics.value = false;
    })
    .catch((error) => {
      loadingTopics.value = false;
      console.error(JSON.stringify(error));
    });
};

const updateCourse = async () => {
  isSaving.value = true;

  const objectives = learningObjectives.value.filter((e) => e.value);
  const courseForList = courseFor.value.filter((e) => e.value);
  const requirementsList = requirements.value.filter((e) => e.value);
  const topicsSelected = topics.value.filter((e) => e.selected);

  if (
    objectives.length >= IN_LEARN_NUMBER &&
    courseForList.length >= 1 &&
    requirementsList.length >= 1 &&
    topicsSelected.length > 1
  ) {
    const fields = {
      objectives: objectives.map((e) => ({ order: e.order, value: e.value, id: e.id })),
      courseFor: courseForList.map((e) => ({ order: e.order, value: e.value, id: e.id })),
      requirements: requirementsList.map((e) => ({ order: e.order, value: e.value, id: e.id })),
      topics: topicsSelected.map((e) => e.id).join(';'),
    };

    try {
      const response = await coursesIntendedLearners(props.course.id, fields);
      await response.json();
      emit('refresh');
      alert.value.toast(t('it.tile'), t('toast_success'), 'success');
    } catch (e) {
      alert.value.toast(t('it.tile'), t('error_occur'), 'error');
    }
  } else {
    alert.value.toast(t('Error'), t('it.required_field_message'), 'error');
  }

  isSaving.value = false;
};

const init = (course: Course) => {
  if (course.requirements?.length) {
    requirements.value = course.requirements.map((e) => ({ ...e, name: `requirement_${e.order}` }));
  }
  if (course.courseFor?.length) {
    courseFor.value = course.courseFor.map((e) => ({ ...e, name: `courseFor_${e.order}` }));
  }
  if (course.objectives?.length) {
    learningObjectives.value = course.objectives.map((e) => ({ ...e, name: `leaObject_${e.order}` }));
  }
  category.value = course.categories || null;
  subcategory.value = course.subCategory || null;

  getTopics();
  loading.value = false;
};

watch(
  () => props.course,
  (newVal) => {
    if (newVal?.id) {
      init(newVal);
    }
  },
  { immediate: true }
);

onMounted(() => {
  alert.value = document.querySelector('#message'); // or ref binding in template
  if (props.course?.id) {
    init(props.course);
  }
});
</script>


<style scoped>
.g-container {

  padding: 12px;
}



.g-intented-item {
  margin: 2em 0;
}

.g-intented-item_title {
  font-weight: 700;
  font-size: 1em;
  font-family: 'Benton Sans', sans-serif;
  padding-bottom: 0.3em;
}

.g-intented-item_description {
  font-size: small;
  padding-bottom: 0.4em;
  font-family: 'Benton Sans', sans-serif;
}

.skills {
  padding: 1em 2em;
  background-color: #f1f4f7;
}

.skills_value {
  margin: 1em 0;
}

.target {
  border-radius: 2em;
  margin: 0.5em 0.5em;
  background-color: white;
  border: 0.01em solid black;
}

.target:hover {
  outline: gray;
  border: 0.05em solid black;
  background-color: green;
  color: white;
}

.target_selected {
  background-color: green;
  color: white;
}

.topic {
  margin-bottom: 2em;
}

.form-control {
  font-size: 1em;
}

.btn {
  font-size: 1em;
}
</style>
