<template>
  <div class="flex items-center w-full group relative">
    <!-- Bordered Input Area -->
    <div class="flex items-center border rounded px-3 py-2 flex-grow transition hover:border-gray-400">
      <input
        v-model="inputValue"
        :maxlength="maxLength"
        :placeholder="placeholder"
        class="flex-grow outline-none border-none bg-transparent"
        @input="updateCount"
      />
      <div class="text-xs text-gray-500 ml-2 whitespace-nowrap">
        {{ inputValue.length }} / {{ maxLength }}
      </div>
    </div>

    <!-- Buttons Outside the Border -->
    <div
      v-if="inputValue.trim().length > 0"
      class="ml-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <button
        class="border rounded p-1 hover:bg-gray-100 transition"
        type="button"
        @click="$emit('remove')"
      >
        <i class="bi bi-trash3"></i>
      </button>
      <button
        class="border rounded p-1 hover:bg-gray-100 transition"
        type="button"
        @click="$emit('reposition')"
      >
        <i class="bi bi-text-center"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: String,
  maxLength: {
    type: Number,
    default: 120
  },
  placeholder: String
});

const emit = defineEmits(['update:modelValue', 'remove', 'reposition']);

const inputValue = ref(props.modelValue || '');

watch(inputValue, (val) => {
  emit('update:modelValue', val);
});

const updateCount = () => {
  if (inputValue.value.length > props.maxLength) {
    inputValue.value = inputValue.value.slice(0, props.maxLength);
  }
};
</script>
