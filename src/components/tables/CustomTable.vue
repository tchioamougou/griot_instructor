<template>
  <div class="w-full">
    <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      <table class="min-w-full text-left text-sm text-gray-700">
        <thead class="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
          <tr>
            <th v-for="(column, idx) in columns" :key="idx" class="px-4 py-3 whitespace-nowrap">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
            <tr v-if="paginatedRows.length === 0">
                <td :colspan="columns.length" class="text-center text-gray-500 py-6">
                No record to display
                </td>
            </tr>

          <tr
            v-for="(item, index) in paginatedRows"
            :key="index"
             v-else
            class="border-t hover:bg-gray-50 transition duration-150 ease-in-out"
          >
            <td v-for="(column, colIndex) in columns" :key="colIndex" class="px-4 py-3 whitespace-nowrap">
              <span v-if="column.type === 'text'">{{ item[column.key] }}</span>

              <span v-else-if="column.type === 'status'">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': item[column.key] === 'Success',
                    'bg-red-100 text-red-800': item[column.key] === 'Failed'
                  }"
                >
                  {{ item[column.key] }}
                </span>
              </span>

              <span v-else-if="column.type === 'icon' && item[column.key]">
                <component :is="column.icon" class="w-5 h-5 text-gray-600 cursor-pointer hover:text-black" />
              </span>

              <span v-else>
                {{ item[column.key] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center items-center space-x-2 mt-4" v-if="totalPages > 1">
      <button
        class="h-8 w-8 flex items-center justify-center border border-purple-400 rounded-full text-purple-600"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        ‹
      </button>

      <button
        v-for="n in totalPages"
        :key="n"
        class="h-8 w-8 flex items-center justify-center rounded-full border border-purple-400 text-purple-600"
        :class="{
          'bg-purple-100 font-bold': currentPage === n,
        }"
        @click="changePage(n)"
      >
        {{ n }}
      </button>

      <button
        class="h-8 w-8 flex items-center justify-center border border-purple-400 rounded-full text-purple-600"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';

interface Column {
  key: string;
  label: string;
  type?: any;
  icon?: Component;
}

const props = defineProps<{
  columns: Column[];
  rows: Record<string, any>[];
  perPage?: number;
}>();

const currentPage = ref(1);
const perPage = computed(() => props.perPage ?? 5);

const totalPages = computed(() =>
  Math.ceil(props.rows.length / perPage.value)
);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return props.rows.slice(start, start + perPage.value);
});

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // Optionally, emit an event to load remote data
    // emit('pageChange', page)
  }
}

// Optional: Watch for rows change and reset pagination
watch(() => props.rows, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
table {
  font-family: 'Inter', sans-serif;
}
</style>
