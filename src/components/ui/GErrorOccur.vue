<template>
  <div class="g-error">
    <i class="bi bi-intersect"></i>
    <span>
      <strong>{{$t('error_occur')}}</strong> <a href="">{{$t('reload_page')}}</a>
    </span>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.g-error{
  padding: 1em 2em;
  background-color: rgb(139, 0, 0,0.5);
  margin-top: 2em;
}
</style>
