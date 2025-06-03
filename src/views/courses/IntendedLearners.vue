<template>
  <ItemLayout :title="$t('IntendedLearners')">
    <template #main>
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
          <div class="input-group mt-2" v-for="lo in learningObjectives" :key="lo.name">
            <CustomInput class="form-control" :placeholder="$t('it.what_you_ll_learn_placeholder')" v-model="lo.value"
              @remove="removeItem('learningObjectives', lo, 'leaObject')" />
          </div>
          <div class="">
            <button class="text-blue-600 mt-2 text-sm hover:underline"
              @click="addItem('learningObjectives', 'leaObject')">{{ $t('add_response') }}</button>

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
          <div class="input-group mt-2" v-for="req in requirements" :key="req.name">
            <CustomInput :placeholder="$t('it.what_required_placeholder')" v-model="req.value"
              @remove="removeItem('requirements', req, 'requirement')" />
          </div>
          <div class="">
            <button class="text-blue-600 mt-2 text-sm hover:underline"
              @click="addItem('requirements', 'requirement')">{{
                $t('add_response') }}</button>
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
          <div class="input-group mb-2" v-for="cf in courseFor" :key="cf.name">
            <CustomInput :placeholder="$t('it.who_placeholder')" v-model="cf.value"
              @remove="removeItem('courseFor', cf, 'leaObject')" />
          </div>
          <div class="">
            <button class="text-blue-600 mt-2 text-sm hover:underline" @click="addItem('courseFor', 'courseFor')">{{
              $t('add_response') }}</button>
          </div>
        </div>
      </div>
    </template>
  </ItemLayout>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  IN_LEARN_NUMBER,
} from '@/utilities/utilityConstant';
import { coursesIntendedLearners } from '@/services/griot_service';
import ItemLayout from './items/ItemLayout.vue';
import CustomInput from '@/components/forms/FormElements/CustomInput.vue';
import { useToast } from 'vue-toastification'
import { emitter } from "@/events/emitter.ts";
import { isLoading } from '@/composables/spinner';

const toast = useToast();

interface Item {
  name: string;
  value: string;
  order: number;
  id?: string;
  showButton?: boolean;
}



const props = defineProps<{
  course: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const { t } = useI18n();

const requirements = ref<Item[]>([]);
const learningObjectives = ref<Item[]>([ ]);
const courseFor = ref<Item[]>([]);

const loading = ref(true);
const isSaving = ref(false);

const addItem = (title: string, prefix: string) => {
  if (title === "learningObjectives") {
    learningObjectives.value.push({
      name: `${prefix}_${learningObjectives.value.length}`,
      value: '',
      order: learningObjectives.value.length,
      showButton: false,
    });
  } else if (title === 'requirements') {
    requirements.value.push({
      name: `${prefix}_${requirements.value.length}`,
      value: '',
      order: requirements.value.length,
      showButton: false,
    });
  } else if (title === 'courseFor') {
    courseFor.value.push({
      name: `${prefix}_${courseFor.value.length}`,
      value: '',
      order: courseFor.value.length,
      showButton: false,
    });
  }

};

const removeItem = (title: string, item: Item, prefix: string) => {
  if (title === 'learningObjectives') {
    learningObjectives.value = learningObjectives.value.filter((e) => e.name !== item.name);
    learningObjectives.value.forEach((e) => {
      if (e.order > item.order) {
        e.order--;
        e.name = `${prefix}_${e.order}`;
      }
    });
  } else if (title === 'requirements') {
    requirements.value = requirements.value.filter((e) => e.name !== item.name);
    requirements.value.forEach((e) => {
      if (e.order > item.order) {
        e.order--;
        e.name = `${prefix}_${e.order}`;
      }
    });
  } else if (title === 'courseFor') {
    courseFor.value = courseFor.value.filter((e) => e.name !== item.name);
    courseFor.value.forEach((e) => {
      if (e.order > item.order) {
        e.order--;
        e.name = `${prefix}_${e.order}`;
      }
    });
  }
};

const updateCourse = async () => {
  isLoading.value = true;

  const objectives = learningObjectives.value.filter((e) => e.value);
  const courseForList = courseFor.value.filter((e) => e.value);
  const requirementsList = requirements.value.filter((e) => e.value);

  if (
    objectives.length >= IN_LEARN_NUMBER &&
    courseForList.length >= 1 &&
    requirementsList.length >= 1
  ) {
    const fields = {
      objectives: objectives.map((e) => ({ order: e.order, value: e.value, id: e.id })),
      courseFor: courseForList.map((e) => ({ order: e.order, value: e.value, id: e.id })),
      requirements: requirementsList.map((e) => ({ order: e.order, value: e.value, id: e.id })),
    };

    try {
      const response = await coursesIntendedLearners(props.course.id, fields);
      await response.json();
      emit('refresh');
      toast.success(t('toast_success'));
    } catch (e) {
      toast.error(t('error_occur'));
    }
  } else {
    toast.error(t('it.required_field_message'));
  }

  isLoading.value = false;
};

const init = (course: Record<string, any>) => {
  if (course.requirements?.length ) {
    requirements.value = course.requirements.map((e: any) => ({ ...e, name: `requirement_${e.order}` }));
  }
  else{
    requirements.value = [{ name: 'requirement_0', value: '', order: 0 }];
  }
  if (course.courseFor?.length) {
    courseFor.value = course.courseFor.map((e: any) => ({ ...e, name: `courseFor_${e.order}` }));
  }else{
    courseFor.value= [{ name: 'courseFor_0', value: '', order: 0 }];
  }
  if (course.objectives?.length) {
    learningObjectives.value = course.objectives.map((e: any) => ({ ...e, name: `leaObject_${e.order}` }));
  }else{
    learningObjectives.value = [{ name: 'leaObject_0', value: '', order: 0 }];
  }
  loading.value = false;
};
onMounted(() => {
  if (props.course?.id) {
    init(props.course);
  }
  console.log("IntendedLearners mounted with course:", props.course);
  emitter.on("save-intended-learners", updateCourse);

});
onBeforeUnmount(() => {
  emitter.off("save-intended-learners", updateCourse);
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
