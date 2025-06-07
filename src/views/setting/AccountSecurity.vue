<template>
  <div class="space-y-6 bg-white dark:bg-gray-950 p-8 rounded-xl shadow-sm">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
      {{ $t('account_security') }}
    </h2>

    <div class="flex flex-col md:flex-row gap-8">
      <!-- Colonne 1 : Email + Password -->
      <div class="flex-1 ">
        <div class="relative lg:flex gap-2 self-start content-start">
          <div class="w-full">
            <Input v-model="primaryEmail" :type="'Email'" label="Email" :disabled="!editingPrimary"
              placeholder="you@example.com" />
          </div>
          <div class="flex justify-end h-10 gap-1 content-center self-center mt-2">
            <Button @click="toggleEditPrimary" size="sm" variant="neutral">
              {{ editingPrimary ? t('Cancel') : t('edit') }}
            </Button>
            <Button size="sm" v-if="editingPrimary" @click="savePrimaryEmail">
              {{ t('save') }}
            </Button>
          </div>
        </div>

        <div>
          <div class="my-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="block text-md font-semibold text-gray-700 mb-1">{{ t('password') }}</h4>
                <p class="text-xs text-gray-500">
                  {{ t('last_changed') }}: {{ passwordLastChanged }}
                </p>
              </div>
              <Button size="sm" @click="isModalOpen = true">
                {{ t('change_password') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ $t('multi_factor_auth') }}
        </h3>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ $t('mfa_description') }}
          <a href="#" class="text-purple-600 hover:underline">
            {{ $t('help_center_article') }} </a>.
        </p>

        <div class="mt-4">
          <Button size="sm">
            {{ $t('enable') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <Modal v-model:isOpen="isModalOpen">
    <template #title>{{ t('UpdatePassword') }}</template>

    <template #body>
      <form class="space-y-3">
        <Input :label="t('CurrentPassword')" :type="'password'" v-model="passwordForm.currentPassword" :id="'pass'"
          :forLabel="'pass'" />
        <Input :label="t('NewPassword')" :type="'password'" v-model="passwordForm.newPassword" :id="'pass1'"
          :forLabel="'pass1'" />
        <Input :label="t('ConfirmNewPassword')" :type="'password'" v-model="passwordForm.confirmPassword" :id="'pass11'"
          :forLabel="'pass11'" />

        <div v-if="passwordForm.newPassword">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{
            t('PasswordStrength')
            }}</label>
          <div class="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full">
            <div :class="['h-2 rounded-full', passwordStrengthColor]" :style="{ width: `${passwordStrength * 25}%` }">
            </div>
          </div>
          <p class="text-xs mt-1" :class="passwordStrengthTextColor">
            {{ passwordStrengthText }}
          </p>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <Button size="sm" :disabled="!isPasswordFormValid || isLoading" @click="changePassword">
          <span v-if="!isLoading">{{ t('UpdatePassword') }}</span>
          <span v-else class="flex items-center gap-2">
            <Spinner class="w-4 h-4" />
            {{ t('Processing') }}...
          </span>
        </button>
        <Button size="sm" variant="neutral" @click="isModalOpen = false">
          {{ t('Cancel') }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Input from '@/components/forms/FormElements/BaseInput.vue'
import Modal from '@/components/modal/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { ref, computed } from 'vue'

const { t } = useI18n()
const isModalOpen = ref(false)
const primaryEmail = ref('')
const editingPrimary = ref(false)

const toggleEditPrimary = () => {
  editingPrimary.value = !editingPrimary.value
}

const savePrimaryEmail = async () => {
  try {
    console.log('Primary email updated:', primaryEmail.value)
  } catch (error) {
    console.error('Error updating email:', error)
  }
}

const passwordLastChanged = ref('January 15, 2025')
const isLoading = ref(false)
const changingPassword = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Password strength
const passwordStrength = computed(() => {
  const pwd = passwordForm.value.newPassword
  if (!pwd) return 0

  let strength = 0
  if (pwd.length >= 8) strength++
  if (/[A-Z]/.test(pwd)) strength++
  if (/[a-z]/.test(pwd)) strength++
  if (/[0-9]/.test(pwd)) strength++
  if (/[^A-Za-z0-9]/.test(pwd)) strength++

  return Math.min(strength, 4)
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return t('Very Weak')
  if (strength === 1) return t('Weak')
  if (strength === 2) return t('Fair')
  if (strength === 3) return t('Good')
  return t('Strong')
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'bg-red-500'
  if (strength === 2) return 'bg-yellow-500'
  if (strength === 3) return 'bg-green-500'
  return 'bg-green-600'
})

const passwordStrengthTextColor = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'text-red-500'
  if (strength === 2) return 'text-yellow-500'
  if (strength === 3) return 'text-green-500'
  return 'text-green-600'
})

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.currentPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
    passwordStrength.value >= 3
  )
})

const changePassword = async () => {
  try {
  } catch (error) {
    console.error('Error updating password:', error)
  }
}

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}
</script>
