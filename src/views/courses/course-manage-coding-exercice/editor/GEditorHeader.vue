<template>
  <div class="g-editor-header">
    <div class="g-heading-md g-editor-header--title" data-purpose="header-title">Solution</div>
    <i class="bi bi-patch-exclamation-fill text-white g-text-sm"></i>
    <div class="g-editor-header--spacer"></div>
    <slot name="header"></slot>
    <i class="bi bi-arrow-counterclockwise mx-3 text-white"></i>
  </div>
</template>
<script setup>

</script>


<style scoped>
.g-editor-header {
  height: 4rem;
  min-height: 4rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #2d2f31;
  border-bottom: 1px solid #3e4143
}

.g-editor-header--title {
  color: #fff;
  margin-left: 1.6rem;
  margin-right: .4rem
}

.g-editor-header--spacer {
  flex: 1;
  position: relative;
  margin: 0 2.4rem
}
</style>