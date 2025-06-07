<template>
  <div class=" bg-white dark:bg-gray-950 p-8 rounded-xl shadow-sm">
    <div class="g-form-group">
      <h1 class="g-heading-serif-lg mb-4"> {{ $t('Instructors') }}:</h1>
      <template v-if="canNotDelete">
        <p class="mb-5">{{ $t('instructor_ob.cannot_delete_p1_text') }}<a href="#">{{ $t('contact_assistance') }}</a>
        </p>
        <p>{{ $t('instructor_ob.cannot_delete_p2_text_1') }} <a href="/revenue_report">{{ $t('revenue_report') }}</a>
          {{ $t('instructor_ob.cannot_delete_p2_text_2') }}</p>
      </template>
      <template v-else>
        <p>{{ $t('sure_to_delete_account') }}</p>
        <div class="mt-5">
          <Button class="g-button bg-danger" @click="onDeleteAccount">{{ $t('CloseAccount') }}</button>
        </div>
      </template>
    </div>

 
    <Modal ref="closeAccount"  @cancel="cancel" :is-open="isOpen"
      @continue="handleDeleteAccount">
      <template #title>
        {{ $t('CloseAccount') }}
      </template>
      <template #body>
        <div v-if="isError" class="text-danger">
          <span>{{ $t(errorMessage) }}</span>
        </div>

        <BaseInput type="email" :placeholder="$t('please_enter_an_email_address')" v-model="userLogin.userName" label="Email"
          required/>
        <BaseInput type="password" :placeholder="$t('please_enter_a_Password')" v-model="userLogin.userPassword" :label="$t('password')"
          required/>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button size="sm" variant="neutral" @click="cancel">{{ $t('Cancel') }}</Button>
          <Button size="sm" variant="danger" @click="handleDeleteAccount"
          :disabled="!userLogin.userName || !userLogin.userPassword"
          
          ><Spinner v-if="isLoading"></Spinner>{{ $t('delete') }}</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth } from "@/firebase";
import { deleteUserDb } from "@/services/griot_service";
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '@/composables/user';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/modal/Modal.vue'
import { useToast } from 'vue-toastification';
import BaseInput from '@/components/forms/FormElements/BaseInput.vue';
import Spinner from '@/components/spinner/Spinner.vue'

const { t } = useI18n()
const toast = useToast();
const user = computed(() => JSON.parse(useAuthStore().getUser));

const canNotDelete = computed(() => {
  return user.value.totalStudents && user.value.totalStudents > 0
})
const email = ref<string>('');
const isError = ref<boolean>(false);
const errorMessage = ref<string>("");
const userLogin = ref({ userName: '', userPassword: '' });
const isOpen = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const cancel = () => {
  isOpen.value = false;
}
const onDeleteAccount = () => {
 isOpen.value = true;
}
const validateChange = () => {
  if (!userLogin.value.userName || !userLogin.value.userPassword) {
    isError.value = true;
    errorMessage.value = 'Please enter email and password';
    return false;
  } else {
    if (email.value !== userLogin.value.userName) {
      isError.value = true;
      errorMessage.value = 'your email address is not correct';
      return false;
    }
  }
  return true;
}
const handleDeleteAccount = () => {
  if (validateChange()) {
isLoading.value = true;
    signInWithEmailAndPassword(auth, userLogin.value.userName, userLogin.value.userPassword)
      .then((userCredential) => {
        let pro = deleteUserDb(user.value.id);
        pro.then(async (response) => {
          if (response.status === 200) {
            await deleteUser(userCredential.user);
            
            window.location.href = '/';
            isLoading.value = false;
          } else {
            throw new TypeError('error');
          }
        }).catch((error) => {
          isError.value = true;
          errorMessage.value = 'And error occur please try again later';
          console.log(error);
         isLoading.value = false;
        })
      }).catch((error) => {
        isError.value = true;
        errorMessage.value = 'You Credential are not correct';
        console.log(error);
        isLoading.value = false;
      });
  }
}
const init = () => {
  email.value = user.value.email;
}
// setup
init();
</script>
<style scoped>
.g-form-group {
  min-width: 18rem;
  max-width: 60rem;
}
</style>