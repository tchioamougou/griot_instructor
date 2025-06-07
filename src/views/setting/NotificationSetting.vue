<template>
   <div class=" bg-white dark:bg-gray-950 p-8 rounded-xl shadow-sm">
    <div class="cont " >
      <h1 class="g-heading-serif-lg">
        {{ $t('notification_ob.instructor_title') }}
      </h1>
      <div class="d-flex g-border-1 top p-4">
        <input type="checkbox" class="me-3" v-model="user.alertInstructor">
        <label>
          <h2 class="g-heading-md">{{ $t('notification_ob.auth_instructor_header') }}</h2>
          <p class="g-text-sm mt-3">{{ $t('notification_ob.auth_instructor_desc') }}</p>
        </label>
      </div>
    </div>
    <Button size ="sm" class="g-button mt-3" @click="save" :disabled="isSaving">
      <spinner-cmp v-if="isSaving" />
      {{ $t('save') }}</button>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref } from "vue";
import SpinnerCmp from "@/components/spinner/Spinner.vue";
import { updateProfileInformation } from "@/services/griot_service";
import { useAuthStore } from '@/composables/user'
import Button from '@/components/ui/Button.vue'
import { useToast } from 'vue-toastification';

const { t } = useI18n()
const toast = useToast();
const user = computed(() => JSON.parse(useAuthStore().getUser));
const isSaving = ref(false);
const save = () => {
    isSaving.value = true;
    updateProfileInformation(user.value.id, user.value).then((response) => {
      if (response.status !== 200) {
        throw new TypeError(`${response.status}`);
      } else {
        return response.json();
      }
    }).then((result) => {
      useAuthStore().login(result, result.id);
      toast.success(t('your_notification_set'));
      isSaving.value = false;
    }).catch((error) => {
     toast.error(t('your_notification_set_error'));
      isSaving.value = false;
      console.log(error);
    })
}

</script>
<style scoped>
@import url(@/assets/css/inputcheckbox.css);

input[type="checkbox"] {
  min-width: 20px;
  max-height: 20px !important;
}

.g-border-1 {
  border-color: #0a0809;
}

.cont {
  min-width: 18rem;
  max-width: 60rem;
}
</style>