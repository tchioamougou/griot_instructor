<template>
  <div class="mb-4">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <!-- Input Wrapper -->
    <div class="relative">
      <input
        v-model="localValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :type="type??'text'"
        class="w-full border border-gray-300 rounded px-3 py-2 pr-16 focus:outline-none focus:ring focus:border-blue-500 text-sm"
      />
      <!-- Maxlength Counter inside the input border -->
      <span
        v-if="maxlength"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none"
      >
        {{ `${localValue}`.length }}/{{ maxlength }}
      </span>
    </div>

    <!-- Description text -->
    <p v-if="description" class="mt-1 text-xs text-gray-500">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// Props definition
const props = defineProps<{
  modelValue: string|number;
  label?: string;
  placeholder?: string;
  maxlength?: number;
  description?: string; // 👈 Add support for input description
  type?:string
}>();

// Emit definition
const emit = defineEmits<{
  (e: 'update:modelValue', value: string|number): void;
}>();

// Local state
const localValue = ref(props.modelValue ?? '');

// Sync external -> local
watch(
  () => props.modelValue,
  (val) => {
    if (val !== localValue.value) localValue.value = val;
  }
);

// Sync local -> external
watch(localValue, (val) => {
  emit('update:modelValue', val);
});
</script>
