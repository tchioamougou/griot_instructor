<template>
  <div class="container mx-auto py-12 px-4">
    <div class="mb-6">
      <h1 class="text-4xl font-serif font-bold">Profile & settings</h1>
    </div>

    <g-tabs-simple :tabs="items" ref="itemRefs" @selected="selectItem" />

    <template v-if="isLoading">
      <spinner-cmp color="text-black" />
    </template>

    <template v-else>
      <div v-if="!localUserinfo || !localUserinfo.id" class="text-center text-gray-500 mt-12">
        <i class="bi bi-intersect text-3xl"></i>
        <p><strong>An Error Occurred.</strong> <a href="" class="text-blue-500 underline">Reload page</a></p>
      </div>

      <template v-if="currentItem === itemsName.profile">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <!-- Left Column -->
          <div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" class="w-full border rounded-md p-2" v-model="localUserinfo.firstName" placeholder="First Name" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" class="w-full border rounded-md p-2" v-model="localUserinfo.lastName" placeholder="Last Name" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Headline</label>
                <input type="text" class="w-full border rounded-md p-2" v-model="localUserinfo.headLine" placeholder="Headline" />
              </div>
              <div>
                <g-rich-text-editor label="Biography" v-model="localUserinfo.bio" :content="localUserinfo.bio" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Language</label>
                <select class="w-full border rounded-md p-2" v-model="localUserinfo.language">
                  <option value="French">French</option>
                  <option value="Italy">Italy</option>
                  <option value="English">English</option>
                  <option value="Swahili">Swahili</option>
                </select>
              </div>
              <g-select :options="currencyOptions" v-model="currency" :disabled="isSaving" label="Preferred currency" />
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Website</label>
                <input type="url" class="w-full border rounded-md p-2" v-model="localUserinfo.website" placeholder="Website" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Twitter</label>
                <div class="flex border rounded-md overflow-hidden">
                  <span class="px-3 py-2 bg-gray-100 text-sm text-gray-600">https://www.twitter.com/</span>
                  <input type="text" class="flex-1 p-2" v-model="localUserinfo.twitter" placeholder="Username" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Facebook</label>
                <div class="flex border rounded-md overflow-hidden">
                  <span class="px-3 py-2 bg-gray-100 text-sm text-gray-600">https://www.facebook.com/</span>
                  <input type="text" class="flex-1 p-2" v-model="localUserinfo.facebook" placeholder="Username" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">LinkedIn</label>
                <div class="flex border rounded-md overflow-hidden">
                  <span class="px-3 py-2 bg-gray-100 text-sm text-gray-600">https://www.linkedin.com/</span>
                  <input type="text" class="flex-1 p-2" v-model="localUserinfo.linkedIn" placeholder="Username" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Youtube</label>
                <div class="flex border rounded-md overflow-hidden">
                  <span class="px-3 py-2 bg-gray-100 text-sm text-gray-600">https://www.youtube.com/</span>
                  <input type="text" class="flex-1 p-2" v-model="localUserinfo.youtube" placeholder="Username" />
                </div>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="md:col-span-2 flex justify-center mt-6">
            <button class="bg-black text-white px-6 py-2 rounded-md disabled:opacity-50" :disabled="noModification" @click="save">
              <span v-if="isSaving">
                <span class="spinner-border text-white spinner-border-sm" role="status"></span>
              </span>
              <span class="ms-1">Save</span>
            </button>
          </div>
        </div>
      </template>

      <!-- Profile Picture Tab -->
      <template v-if="currentItem === itemsName.picture">
        <div class="max-w-lg">
          <label class="block text-sm font-medium text-gray-700">Image</label>
          <div class="border bg-green-100 p-2 text-center">
            <img :src="localUserinfo.picture" alt="image" class="mx-auto max-h-52" />
          </div>
          <g-upload-files v-model="localUserinfo.picture" repository="ProfileImage" :user="user" source="Profile" />
          <button class="mt-4 bg-black text-white px-4 py-2 rounded-md" @click="save" :disabled="noModification">
            <spinner-cmp v-if="isSaving" />
            Save
          </button>
        </div>
      </template>

      <!-- Privacy Settings Tab -->
      <template v-if="currentItem === itemsName.privacySettings">
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">Privacy Setting</label>
          <div class="flex items-center space-x-2">
            <input type="checkbox" class="h-4 w-4 text-black border-gray-300 rounded" v-model="localUserinfo.showProfileOnEngine" />
            <label class="text-sm text-gray-700">Show your profile on search engines</label>
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" class="h-4 w-4 text-black border-gray-300 rounded" v-model="localUserinfo.showCourseOnProfile" />
            <label class="text-sm text-gray-700">Show courses you're taking on your profile page</label>
          </div>
          <button class="mt-4 bg-black text-white px-4 py-2 rounded-md" @click="save" :disabled="noModification">
            <spinner-cmp v-if="isSaving" />
            Save
          </button>
        </div>
      </template>
    </template>
  </div>
</template>
<script setup>
import {computed, defineAsyncComponent, ref, watch} from "vue";
import _ from "lodash";
import store from "../store";
import router from "../router";
import {
  PROFILE_TABS_ITEM_API_NAMES,
  PROFILE_TABS_ITEMS,
} from "./utilityConstant";
import {getUser, updateProfileInformation} from "../database/griot";
import SpinnerCmp from "./Spinner.vue";
import {CURRENCY_OB} from "@/resources/commonCurrency";
import GSelect from "@/resources/GSelect.vue";

const GTabsSimple = defineAsyncComponent(() => import("./GTabsSimple.vue"));
const GUploadFiles = defineAsyncComponent(() => import("./GUploadFiles.vue"));
const GRichTextEditor = defineAsyncComponent(() =>
    import("./GRichTextEditor.vue")
);
const itemRefs = ref(null);
const user = computed(() => {
  return store.state.user;
});
const isSaving = ref(false);
const items = PROFILE_TABS_ITEMS;
const currentItem = ref(PROFILE_TABS_ITEM_API_NAMES.profile);
const localUserinfo = ref({});
const isLoading = ref(false);
const initialUser = ref(false);
const itemsName = PROFILE_TABS_ITEM_API_NAMES;
const noModification = ref(true);
const props = defineProps({
  item: String,
});
const currency = ref(null);
const getParameters = () => {
    getUsersDetails();
};
const currencyOptions = ref(
    CURRENCY_OB.map((e) => {
      return {...e, originalName: e.name, name: e.code, value: e.code};
    })
);
const getUsersDetails = () => {
  isLoading.value = true;
  getUser(user.value.id)
      .then((response) => {
        console.log("getInstructorLocal=>response", response);
        return response.json();
      })
      .then((data) => {
        initialUser.value = {...data};
        localUserinfo.value = data;
        currency.value = data.currencyCode
        isLoading.value = false;
        store.dispatch('fetchUser');
        console.log("getInstructorLocal=>result", data);
      })
      .catch((error) => {
        console.log("getInstructorLocal", error);
        isLoading.value = false;
      });
};
const selectItem = (item) => {
  console.log("recpord", item);
  if (currentItem.value !== item.name) {
    currentItem.value = item.name;
  }
};
watch(
    () => itemRefs.value,
    (val) => {
      console.log("fhg", currentItem.value);
      itemRefs.value.gotoTab(currentItem.value);
    }
);
watch(
    () => localUserinfo.value,
    (val) => {
      noModification.value = _.isEqual(val, initialUser.value);
    },
    {deep: true}
);
watch(
    () => currency.value
    ,
    (val) => {
      if (currency.value !== localUserinfo.value.currencyCode) {
        const cur = currencyOptions.value.filter(e => e.name === val)[0];
        console.log(cur);
        console.log(currencyOptions);
        localUserinfo.value.currencyCode = currency.value;
        localUserinfo.value.currencyName = cur.originalName;
        localUserinfo.value.currencySymbol = cur.symbol;
        console.log(localUserinfo.value);

      }
    },
    {deep: true}
);
const save = () => {
  console.log("getInstructorLocal=>localUserinfo.value", localUserinfo.value);

  isSaving.value = true;
  updateProfileInformation(user.value.id, localUserinfo.value)
      .then((response) => {
        console.log("updateProfileInformation===>Response", response);
        return response.json();
      })
      .then((result) => {
        console.log("updateProfileInformation===>result", result);
        isSaving.value = false;
        initialUser.value = result;
        noModification.value = true;
        store.dispatch('refreshUser', user.value.id)
      })
      .catch((error) => {
        console.log("updateProfileInformation===>error", error);
        isSaving.value = false;
      });
};
/** get Parameters*/
getParameters();
</script>
<style scoped>
</style>
