<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 modal z-99999 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8"
      >
        <!-- Overlay -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('update:isOpen', false)"
        ></div>

        <!-- Modal Panel -->
        <div
          class="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-xl overflow-hidden transition-all transform"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              <slot name="title">Modal Title</slot>
            </h3>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
              @click="$emit('update:isOpen', false)"
            >
              <span class="sr-only">Close</span>
              ✖
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <slot name="body"></slot>
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits(['update:isOpen'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
