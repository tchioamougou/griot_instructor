<template>
  <div class="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
    <div
      class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[10px]"
      aria-hidden="true"
      @click="$emit('close')"
    ></div>
    <slot name="body"></slot>
  </div>
</template>

<script setup lang="ts">
// No additional setup needed
</script>
