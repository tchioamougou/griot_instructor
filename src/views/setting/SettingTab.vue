<script  setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'

interface Tab {
  id: number
  label: string
}

interface Props {
  tabs: Tab[]
  activeTab: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:activeTab', id: number): void
}>()

const tabsRef = ref<(HTMLElement | null)[]>([])
const indicatorStyle = ref({
  width: '0px',
  transform: 'translateX(0px)',
})

const updateIndicator = () => {
  const index = props.tabs.findIndex((tab) => tab.id === props.activeTab)
  const el = tabsRef.value[index]
  if (el) {
    indicatorStyle.value = {
      width: `${el.offsetWidth}px`,
      transform: `translateX(${el.offsetLeft}px)`,
    }
  }
}

const onResize = () => updateIndicator()

onMounted(async () => {
  await nextTick()
  updateIndicator()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

watch(() => props.activeTab, () => {
  nextTick().then(updateIndicator)
})
</script>

<template>
  <div class="relative">
    <ul class="flex space-x-2 border-b border-gray-200 bg-white px-4 rounded-lg shadow-lg dark:bg-gray-900">
      <li
        v-for="(tab, index) in props.tabs"
        :key="tab.id"
        class="relative"
      >
        <button
          ref="el => tabsRef.value[index] = el"
          @click="emit('update:activeTab', tab.id)"
          class="px-4 py-3 text-sm font-semibold transition-all duration-300 ease-in-out"
          :class="props.activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>

    <!-- Animated Active Tab Indicator -->
    <div
      class="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
      :style="indicatorStyle"
    />
  </div>
</template>
