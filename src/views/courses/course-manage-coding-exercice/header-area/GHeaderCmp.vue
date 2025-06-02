<template>
<head class="d-flex justify-content-between g-header g-Header-shadow ">
  <div class="d-flex justify-content-center">
    <a :href="url" class="me-5"> &#10094; {{ $t("back_to_curriculum") }}</a>
    <span class="g-heading-sm pt-2">{{item.title}}</span>
  </div>
  <div>
    <button class="g-button-md g-button bg-white text-dark g-border-1 fw-bold g-text-sm">{{$t("preview")}} <i class="bi bi-box-arrow-up-right"></i></button>
    <!--<button>{{$t("unpublish")}}</button>-->
    <button class="g-button bg-white text-dark g-border-1 fw-bold g-text-sm">{{$t("save")}}</button>
    <button class="g-button fw-bold g-text-sm">{{$t("publish")}}</button>
  </div>
</head>
</template>
<script setup>
const props = defineProps({
  url:String,
  item:{
    type:Object,
    required:true
  }
})
</script>
<style scoped>
@import url(../../../../assets/css/link.css);
.g-header {
  border-bottom: 1px var(--griot-gray-300) solid;
}
.g-button{
  margin: 0em 0.5em;
  padding: 0.5rem 1.2rem;
}
.g-button.bg-white:hover{
  background-color: var(--griot-gray-200) !important;
}
.g-button:hover{
  opacity: 0.8;
}
.g-border-1{
  border-color: black;
}

</style>