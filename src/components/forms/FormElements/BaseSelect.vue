<template>
  <div class="mb-4">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
    </label>
    <select
      v-model="model"
      class="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring focus:border-blue-500"
    >
      <option disabled >{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps<{
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  options: Record<string, any>[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (val: string | number) => emit('update:modelValue', val),
});
</script>
