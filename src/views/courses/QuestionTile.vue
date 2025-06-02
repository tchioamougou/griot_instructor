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

<script>
import {extractContent} from "../../resources/UtilityFunction";

export default {
  name: "QuestionTile",
  emits:['edit','delete'],
  props:{
    question:{
      type:Object,
      required:true,
    },
    position:{
      type:Number,
      required:true,
    }
  },
  methods:{
    remove(){
      this.$emit('delete')
    },
    edit(){
      this.$emit('edit');
    }
  },
  computed:{
    content(){
      return extractContent(this.question.content, true);
    }
  }
}
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