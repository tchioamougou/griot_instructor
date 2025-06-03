<template>
    <div class="mb-6">
        <!-- Header with Icon, Title, and Slot on the right -->
        <div class="flex items-center justify-between border-b pb-2 mb-4">
            <div class="flex items-center space-x-2">
                <slot name="icon">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </slot>
                <h2 class="text-lg font-semibold">{{ title }}</h2>
            </div>
            <slot name="right" />
        </div>

        <!-- Main content -->
        <div>
            <slot name="main" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    title: String
});
</script>
