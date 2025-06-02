<template>
    <div
        class="flex flex-wrap justify-between items-center bg-gray-900 text-white px-4 py-2 space-y-2 sm:space-y-0 sm:flex-nowrap">
        <!-- Left Section -->
        <div class="flex flex-wrap items-center space-x-3">
            <button @click="emit('back')" class="text-sm text-gray-400 hover:text-white whitespace-nowrap">
                &lt; Back to courses
            </button>

            <div class="flex items-center space-x-2">
                <h1 class="text-base sm:text-lg font-semibold whitespace-nowrap">
                    <span class="font-bold">{{ course.title }}</span>
                    <span class="font-medium"> ({{ course.year }})</span>
                </h1>
                <span v-if="course.isLive" class="text-xs bg-gray-700 text-white px-2 py-0.5 rounded">
                    LIVE
                </span>
            </div>

            <span class="text-sm text-gray-300 whitespace-nowrap">
                {{ course.videoLength }} of video content published
            </span>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-2 mt-2 sm:mt-0">
            <button v-if="showSaveButton" :disabled="!saveEnabled" @click="onSaveClick"
                class="text-sm px-3 py-1 rounded transition-all duration-150"
                :class="saveEnabled ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'">
                Save
            </button>

            <!-- Settings Button -->
            <button class="p-1 rounded hover:bg-gray-800" aria-label="Settings">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M11.3 1.046a1 1 0 00-2.6 0l-.195.565a1.028 1.028 0 01-.908.678l-.582.051a1 1 0 00-.8.584l-.24.553a1 1 0 01-.684.57l-.592.11a1 1 0 00-.612 1.442l.365.656a1 1 0 01-.04.982l-.347.55a1 1 0 00.008 1.144l.347.55a1 1 0 01.04.982l-.365.656a1 1 0 00.612 1.442l.592.11a1 1 0 01.684.57l.24.553a1 1 0 00.8.584l.582.051a1.028 1.028 0 01.908.678l.195.565a1 1 0 002.6 0l.195-.565a1.028 1.028 0 01.908-.678l.582-.051a1 1 0 00.8-.584l.24-.553a1 1 0 01.684-.57l.592-.11a1 1 0 00.612-1.442l-.365-.656a1 1 0 01.04-.982l.347-.55a1 1 0 00-.008-1.144l-.347-.55a1 1 0 01-.04-.982l.365-.656a1 1 0 00-.612-1.442l-.592-.11a1 1 0 01-.684-.57l-.24-.553a1 1 0 00-.8-.584l-.582-.051a1.028 1.028 0 01-.908-.678L11.3 1.046zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>


const props = defineProps<{
    course:  Record<string, any>
    saveEnabled: boolean
    showSaveButton: boolean
}>()

const emit = defineEmits<{
    (e: 'save'): void,
    (e: "back"): void
}>()

function onSaveClick() {
    if (props.saveEnabled) {
        emit('save')
    }
}
</script>
