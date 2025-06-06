<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/25 bg-opacity-40">
        <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h2 class="text-xl font-semibold mb-4">Verify Your Phone Number</h2>

            <!-- Country Selector -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select disabled class="w-full border-gray-300 rounded-md shadow-sm text-sm p-2">
                    <option value="+237">🇨🇲 Cameroon (+237)</option>
                </select>
            </div>

            <!-- Phone Input -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div class="flex items-center space-x-2">
                    <span
                        class="text-sm bg-gray-100 px-3 py-2 rounded-l-md border border-r-0 border-gray-300">+237</span>
                    <input v-model="phone" type="tel" maxlength="9" placeholder="6XXXXXXXX"
                        class="flex-1 p-2 border border-gray-300 rounded-r-md text-sm" />
                </div>
                <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
            </div>

            <!-- Verify Checkbox -->
            <div class="mb-4 flex items-start space-x-2">
                <input v-model="verified" type="checkbox" class="mt-1" />
                <label class="text-sm text-gray-700">I confirm that this phone number is correct and belongs to
                    me.</label>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-2">
                <button @click="close" class="px-4 py-2 text-sm text-gray-700 rounded-md border">Cancel</button>
                <button @click="submit" :disabled="!canSubmit"
                    class="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50">
                    Verify
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineModel } from 'vue'

const emit = defineEmits<{
  (e: 'verify', value: string): void
  (e: 'close'): void
}>()

// Props / model
const model = defineModel<string | null>() // This binds v-model to validated phone

const phone = ref('')
const verified = ref(false)
const error = ref<string | null>(null)

function validatePhone(num: string): boolean {
    return /^6\d{8}$/.test(num)
}

const canSubmit = computed(() => validatePhone(phone.value) && verified.value)

function submit() {
    if (!validatePhone(phone.value)) {
        error.value = 'Phone number must be 9 digits and start with 6 (e.g., 6XXXXXXXX)'
        return
    }
    if (!verified.value) {
        error.value = 'You must confirm that the phone number is yours.'
        return
    }

    error.value = null
    model.value = `+237${phone.value}` // Send to parent
    emit('verify', model.value) // Emit the verified phone number
}

function close() {
    emit('close')
}
</script>
