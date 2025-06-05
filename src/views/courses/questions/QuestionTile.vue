<template>
<div class="g_question_tile">
  <div class="question">{{ position }}. {{content}}</div>
  <div class="type">{{$t(question.type==="Choice"?'Multiple choice':'Multiple selection')}}</div>
  <div class="action">
    <i class="bi bi-pencil-fill" @click="edit"></i>
    <i class="bi bi-trash-fill" @click="remove"></i>
  </div>
</div>
</template>

<script setup lang="ts">
import { extractContent } from '@/utilities/UtilityFunction';
import { defineProps, defineEmits, computed } from 'vue';

interface Question {
  content: string;
  [key: string]: any; // Add more properties as needed
}

const props = defineProps<{
  question: Question;
  position: number;
}>();

const emit = defineEmits<{
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();

const remove = () => {
  emit('delete');
};

const edit = () => {
  emit('edit');
};

const content = computed(() => extractContent(props.question.content, true));
</script>


<style scoped>
.g_question_tile{
  padding: 0.5em 1em;
  display: flex;
  justify-content: space-between;
  font-family: sans-serif;
  font-size: 0.85em;
}
.g_question_tile .question{
width: 80%;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.g_question_tile .action{
  visibility: hidden;
  cursor: pointer;
}
.g_question_tile:hover .action{
  visibility: visible;
}
.action i{
  margin: 0 0.3em;
}
</style>