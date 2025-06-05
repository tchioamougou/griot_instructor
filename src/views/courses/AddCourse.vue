<template>

  <Modal>
    <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
      <form class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
           <div>
            <Select :lb="$t('createNewCourse_Step1_Title')" :options="typeCourseOption" v-model="form.type" />
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400" v-if="form.type==='Course'" >
            {{ $t("createNewCourse_Course_description") }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400" v-if="form.type==='PracticeTest'" >
            {{ $t("createNewCourse_practiceTest_description") }}
          </div>
          <div>
            <Input :inputType="'text'" :lb="$t('createNewCourse_Step2_Title')" :placeholder="$t('e.g. Learn Photoshop CS6 from Scratch')" :id="'title'"
              :forLabel="'title'" v-model="form.title" />
          </div>
          <div>
            <Input :inputType="'text'" :lb="$t('Subtitle')" :placeholder="$t('SubTitle')" :id="'last'"
              :forLabel="'last'" v-model="form.subtitle" />
          </div>

        </div>

        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1">
          <div>
            <Select :lb="$t('createNewCourse_Step3_Title')" :options="categoriesOptions" v-model="courseCategory" />
          </div>

          <div>
            <Select :lb="$t('subCatgory')" :options="courseSubCategoryOptions" v-model="courseSubCategory"  />
          </div>
         
        </div>
        <div class="flex justify-end gap-3">
           <ButtonComponent type="button" :disabled="isLoading" @click="cancel" variant="danger">
             {{ $t('Cancel') }}
             </ButtonComponent>
              <ButtonComponent type="button" :disabled="disabledSave" @click="createCourse">
               <div class="flex gap-2">
                 <Spinner v-if="isSaving"></Spinner>  
               {{ $t('createNewCourse_button_label') }}
               </div>
             </ButtonComponent>
        </div>
      </form>
        </div>
    </template>
  </Modal>

</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"; 
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import ButtonComponent from "@/components/buttons/ButtonComponent.vue";
 import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'; // adapte le chemin
 import Modal from '@/components/profile/Modal.vue'
import { useI18n } from "vue-i18n";
import * as GR_CONST from '@/utilities/utilityConstant'
 import { retrieveDataWithFilter } from '../../firebase/firestore'
import {
  generateReferralCode,
 } from '@/utilities/UtilityFunction'
import { COLLECTION_NAME } from '@/utilities/utilityConstant'
import { createCourses } from '@/services/griot_service'
import { useAuthStore } from '@/composables/user'

const isLoading = ref(false);
const { t } = useI18n();

const toast = useToast();
const typeCourseOption = ref([
  { label: t("createNewCourse_Course"), value: "Course" },
  { label: t("createNewCourse_practiceTest"), value: "PracticeTest" },
]);
const form = ref<Record<string,any>>({})

const emits = defineEmits(['close',"created"])
const categoriesOptions = ref<any[]>([])
const courseCategory = ref<string>('')
const courseSubCategory = ref<string>('')
const courseSubCategoryOptions = ref<any[]>([])
const isSaving = ref(false);
const disabledSave = computed(()=>{
  return !form.value.title || !form.value.type || !form.value.subtitle || !courseCategory.value || !courseSubCategory.value
})

const user = computed(() => JSON.parse(useAuthStore().getUser));

const cancel = () => {
 emits('close')
}

const createCourse = async () => {
  isSaving.value = true
  let course :Record<string,any>= {
    type: form.value.type,
    title: form.value.title,
    categories: categoriesOptions.value.find((e) => e.id === courseCategory.value)?.id,
    subCategory: courseSubCategoryOptions.value.find((e) => e.id === courseSubCategory.value)?.id,
    status: GR_CONST.COURSE_STATUS.unpublished,
    instructorId: user.value.id,
    referralCode: generateReferralCode(),
    subTitle: form.value.subtitle,
    InstructorID: user.value.firebaseId,
  }

  try {
    const response = await createCourses([course])
    const data = await response.json()
    course = data[0]
    isSaving.value = false;
    emits('created',course.id)
  } catch (error) {
    isSaving.value = false
     toast.error( 'Unknown error: Retry again later')
    console.error(error)
  }
}

const retrieveCategory = async () => {
  try {
    const result :any = await retrieveDataWithFilter(COLLECTION_NAME.categories, null, null)
    categoriesOptions.value = result.map((e: any) => ({ ...e, label: e.title, value: e.id }))
    categoriesOptions.value.push({ name: "I don't know yet", value: '0' })
    courseCategory.value = categoriesOptions.value[0].value
  } catch (error) {
    console.error('Error retrieving categories', error)
  }
}

watch(courseCategory, (value) => {
  if (value) {
    const cat = categoriesOptions.value.find((e) => e.id === value)
    if (cat) {
      courseSubCategoryOptions.value = cat.subItems.map((e: any) => ({
        ...e,
        label: e.title,
        value: e.id,
      }))
      courseSubCategory.value = courseSubCategoryOptions.value[0]?.value
    }
  }
})

onMounted(() => {
 // alert.value = (document.querySelector('#messageRef') as any)
  retrieveCategory()
})

</script>
