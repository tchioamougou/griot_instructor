<template>
  <div>
    <div class="no-scrollbar relative w-full rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <!-- Close button -->
      <button
        @click="closeEdit"
        class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
      >
        <XIcon />
      </button>

      <div class="px-2 pr-14">
        <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {{ $t('Edit Personal Information') }}
        </h4>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {{ $t('Update your details to keep your profile up-to-date.') }}
        </p>
      </div>

      <form class="flex flex-col">
        <div class="custom-scrollbar h-[458px] overflow-y-auto p-2">
          <div>
            <h5 class="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              {{ $t('Personal Information') }}
            </h5>

            <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div class="col-span-2 lg:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('First Name') }}
                </label>
                <input
                  type="text"
                  v-model="localUserinfo.firstName"
                  :placeholder="$t('First Name')"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="col-span-2 lg:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('Last Name') }}
                </label>
                <input
                  type="text"
                  v-model="localUserinfo.lastName"
                  :placeholder="$t('Last Name')"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="col-span-2 lg:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('Headline') }}
                </label>
                <input
                  type="text"
                  v-model="localUserinfo.headLine"
                  :placeholder="$t('Headline')"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="col-span-2 lg:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('Phone') }}
                </label>
                <input
                  type="text"
                  v-model="localUserinfo.phone"
                  :placeholder="$t('Phone')"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="col-span-2">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('Bio') }}
                </label>
                <g-rich-text-editor v-model="localUserinfo.bio" :content="localUserinfo.bio" />
              </div>

              <div class="col-span-2 lg:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('Language') }}
                </label>
                <select class="w-full border rounded-md p-2" v-model="localUserinfo.language">
                  <option value="French">{{ $t('French') }}</option>
                  <option value="Italy">{{ $t('Italy') }}</option>
                  <option value="English">{{ $t('English') }}</option>
                  <option value="Swahili">{{ $t('Swahili') }}</option>
                </select>
              </div>

              <div class="col-span-2 lg:col-span-1">
                <BaseSelect
                  :options="currencyOptions"
                  v-model="currency"
                  :disabled="isSaving"
                  :label="$t('Preferred currency')"
                />
              </div>
            </div>
          </div>

          <div class="mt-7">
            <h5 class="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              {{ $t('Social Links') }}
            </h5>

            <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('Facebook') }}
                </label>
                <input
                  type="text"
                  :placeholder="$t('Facebook link placeholder')"
                  v-model="localUserinfo.facebook"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('X.com') }}
                </label>
                <input
                  type="text"
                  :placeholder="$t('Twitter link placeholder')"
                  v-model="localUserinfo.twitter"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('Linkedin') }}
                </label>
                <input
                  type="text"
                  :placeholder="$t('Linkedin link placeholder')"
                  v-model="localUserinfo.linkedIn"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('Youtube') }}
                </label>
                <input
                  type="text"
                  :placeholder="$t('Youtube link placeholder')"
                  v-model="localUserinfo.youtube"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
          </div>

          <div class="mt-7">
            <h5 class="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              {{ $t('Image') }}
            </h5>

            <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div class="border bg-green-100 p-2 text-center">
                <img :src="localUserinfo.picture" alt="image" class="mx-auto max-h-52" />
              </div>
              <g-upload-files
                v-model="localUserinfo.picture"
                repository="ProfileImage"
                :user="user"
                apiName="userIMage"
                :placeholder="$t('UploadFile')"
                allow-file="*"
                :button-name="$t('change')"
                source="Profile"
              />
            </div>
          </div>

          <div class="mt-7">
            <h5 class="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              {{ $t('Privacy Setting') }}
            </h5>

            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <input type="checkbox" class="h-4 w-4 text-black border-gray-300 rounded" v-model="localUserinfo.showProfileOnEngine" />
                <label class="text-sm text-gray-700">{{ $t('Show your profile on search engines') }}</label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="checkbox" class="h-4 w-4 text-black border-gray-300 rounded" v-model="localUserinfo.showCourseOnProfile" />
                <label class="text-sm text-gray-700">{{ $t("Show courses you're taking on your profile page") }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button type="button" variant="outline" @click="closeEdit">
            {{ $t('Close') }}
          </Button>
          <Button @click="saveProfile" type="button" :disabled="noModification">
            <Spinner v-if="isSaving" />
            {{ $t('Save Changes') }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useAuthStore } from '@/composables/user'
import _ from 'lodash'
import { updateProfileInformation } from '@/services/griot_service'
import { CURRENCY_OB } from '@/utilities/commonCurrency'

import Modal from './Modal.vue'
import Spinner from '../spinner/Spinner.vue'
import GRichTextEditor from '../forms/FormElements/GRichTextEditor.vue'
import BaseSelect from '../forms/FormElements/BaseSelect.vue'
import GUploadFiles from '../forms/FormElements/GUploadFiles.vue'
import Button from '../ui/Button.vue'
import { XIcon } from 'lucide-vue-next'

const emits = defineEmits(['close'])

const isSaving = ref(false)
const currency = ref('')
const localUserinfo = ref<Record<string, any>>({})
const initialUser = ref<Record<string, any>>({})
const noModification = ref(true)

const authStore = useAuthStore()
const user = computed(() => JSON.parse(authStore.user))

const currencyOptions = ref(
  CURRENCY_OB.map(e => ({ ...e, originalName: e.name, label: e.code, value: e.code }))
)

const closeEdit = () => emits('close')

watch(
  () => localUserinfo.value,
  val => {
    console.log('change',val)
     console.log('change',initialUser.value)
    noModification.value = _.isEqual(val, initialUser.value)
  },
  { deep: true }
)

watch(
  () => currency.value,
  val => {
    if (val !== localUserinfo.value.currencyCode) {
      const cur = currencyOptions.value.find(e => e.name === val)
      if (cur) {
        localUserinfo.value.currencyCode = cur.code
        localUserinfo.value.currencyName = cur.originalName
        localUserinfo.value.currencySymbol = cur.symbol
      }
    }
  }
)

const saveProfile = () => {
  isSaving.value = true
  updateProfileInformation(user.value.id, localUserinfo.value)
    .then(response => response.json())
    .then(result => {
      isSaving.value = false
      initialUser.value = result
      noModification.value = true
      authStore.login(result, result.id)
    })
    .catch(error => {
      console.error('Error updating profile:', error)
      isSaving.value = false
    })
}

onMounted(() => {
  initialUser.value = {...user.value}
  localUserinfo.value ={...user.value}
  currency.value = user.value.currencyCode
})
</script>
