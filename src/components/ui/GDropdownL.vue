<template>
  <div ref="triggerRef" class="inline-block relative" @click="toggle">
    <!-- Trigger Button -->
    <button
      class="rounded-full hover:bg-gray-200 focus:outline-none  "
    >
      <i class="bi bi-three-dots-vertical text-xl"></i>
    </button>

    <!-- Dropdown Teleported outside -->
    <teleport to="body">
      <div
        v-if="open"
        ref="dropdownRef"
        :style="dropdownStyle"
        class="fixed z-[9999] bg-white rounded shadow-lg 5 min-w-[10rem] max-w-xs"
      >
        <div class="px-4 py-2 text-sm text-gray-500 border-b">{{ $t('settings') }}</div>
        <ul class="py-1">
          <li
            v-for="(op, i) in options"
            :key="i"
            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <i :class="`bi ${op.icon} mr-2`"></i>
            {{ op.label }}
          </li>
        </ul>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

interface DropdownOption {
  icon: string;
  label: string;
}

const props = defineProps<{
  options: DropdownOption[];
}>();

const open = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});

function toggle() {
  open.value = !open.value;
  if (open.value) {
    nextTick(() => {
      positionDropdown();
      document.addEventListener('click', handleOutsideClick);
    });
  } else {
    document.removeEventListener('click', handleOutsideClick);
  }
}

function handleOutsideClick(e: MouseEvent) {
  if (
    !triggerRef.value?.contains(e.target as Node) &&
    !dropdownRef.value?.contains(e.target as Node)
  ) {
    open.value = false;
    document.removeEventListener('click', handleOutsideClick);
  }
}

function positionDropdown() {
  const trigger = triggerRef.value;
  const dropdown = dropdownRef.value;

  if (!trigger || !dropdown) return;

  const triggerRect = trigger.getBoundingClientRect();
  const dropdownRect = dropdown.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Default positioning
  let top = triggerRect.bottom;
  let left = triggerRect.left;

  // Adjust vertically
  if (triggerRect.bottom + dropdownRect.height > viewportHeight) {
    top = triggerRect.top - dropdownRect.height;
  }

  // Adjust horizontally
  if (triggerRect.left + dropdownRect.width > viewportWidth) {
    left = triggerRect.right - dropdownRect.width;
  }

  dropdownStyle.value = {
    top: `${top + window.scrollY}px`,
    left: `${left + window.scrollX}px`,
  };
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
