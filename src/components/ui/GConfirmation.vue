<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="id"
  >
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full">
      <div class="flex justify-between items-center p-4 border-b">
        <h5 class="text-lg font-bold" :id="id">{{ title }}</h5>
        <button
          class="text-gray-500 hover:text-red-500"
          @click="cancel"
          :disabled="isSaving"
          title="Cancel process"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="p-4 text-sm text-gray-700">
        {{ message }}
      </div>

      <div class="flex justify-end gap-2 p-4 border-t">
        <Button variant="neutral"
          :size="'sm'"
          v-if="showCancel"
          class="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          @click="cancel"
          :disabled="isSaving"
        >
          {{ $t('cancel_btn') }}
        </button>

        <Button size="sm"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          @click="accept"
          :disabled="isSaving"
          :title="acceptLabel"
        >
          <spinner-cmp v-if="isSaving" class="inline-block mr-2" />
          {{ acceptLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import SpinnerCmp from '@/components/spinner/Spinner.vue'
import Button from './Button.vue';

const props = defineProps<{
  id: string
  title: string
  message: string
  acceptLabel?: string
  showCancel?: boolean
}>()

const emit = defineEmits(['accepted', 'cancel'])

const isSaving = ref(false)
const visible = ref(false)

function show() {
  visible.value = true
}

function hide() {
  visible.value = false
}

function showSpinner() {
  isSaving.value = true
}

function hideSpinner() {
  isSaving.value = false
}

function accept() {
  emit('accepted')
}

function cancel() {
  emit('cancel')
  hide()
}

defineExpose({ show, hide, showSpinner, hideSpinner })
</script>

<style scoped>
/* Optional additional styling here */
</style>
