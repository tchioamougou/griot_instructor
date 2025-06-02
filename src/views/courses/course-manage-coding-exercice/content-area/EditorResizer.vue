<template>
  <div class="wrapper">
    <div class="left" id="left">
      <slot name="left"></slot>
    </div>
    <div class="right" id="right">
      <slot name="right"></slot>
      <div class="gutter" id="gutter"></div>
    </div>
    <div class="bottom" id="bottom" v-if="showButton">
      <slot name="bottom"></slot>
      <div class="gutterBottom" id="gutterBottom"></div>
    </div>
  </div>
</template>
<script setup>
import {onMounted} from "vue";

let leftPane = document.getElementById("left");
let rightPane = document.getElementById("right");
let gutter = document.getElementById("gutter");
let gutterBottom = document.getElementById("gutterBottom");
const props = defineProps({
  showButton:{
    type:Boolean,
    required:true
  }
})

function resizer(e) {

  window.addEventListener('mousemove', mousemove);
  window.addEventListener('mouseup', mouseup);

  let prevX = e.x;
  const leftPanel = leftPane.getBoundingClientRect();


  function mousemove(e) {
    let newX = prevX - e.x;
    leftPane.style.width = leftPanel.width - newX + "px";
  }

  function mouseup() {
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mouseup', mouseup);
  }


}
function resizerUp(e) {
console.log('event')
  window.addEventListener('mousemove', mousemove);
  window.addEventListener('mouseup', mouseup);

  let prevY = e.y;
  const leftPanel = leftPane.getBoundingClientRect();


  function mousemove(e) {
    let newY = prevY - e.y;
    leftPane.style.height = leftPanel.height - newY + "px";
  }

  function mouseup() {
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mouseup', mouseup);
  }


}
onMounted(() => {
  leftPane = document.getElementById("left");
  rightPane = document.getElementById("right");
  gutter = document.getElementById("gutter");
  gutter.addEventListener('mousedown', resizer);
  if (props.showButton){
    gutterBottom = document.getElementById("gutterBottom");
    gutterBottom.addEventListener('mousedown',resizerUp);
  }
})
</script>
<style scoped>


body {
  margin: 0;
}

.wrapper {
  height: 90vh;
  display: flex;
}

.pane {
  padding: 1em;
  min-width: 20px;
}

.left {
width: 50%;
}

.right {
  width: 50%;
  position: relative;
}

.gutter {
  width: 2px;
  height: 100%;
  background: var(--griot-gray-400);
  position: absolute;
  top: 0;
  left: 0;
  cursor: e-resize;
}
.gutterBottom {
  width: 100%;
  height:1px;
  background: var(--griot-red);
  position: absolute;
  left: 0;
  bottom: 7.5%;
  cursor: n-resize;
  z-index: 100;
}
</style>