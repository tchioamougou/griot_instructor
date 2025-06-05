<template>
  <div class="g-carousel-container_s" v-if="elements && elements.length >0">
    <div class="g-carousel-content-wrapper">
      <div class="g-carousel-content" :style="{ transform: `translateX(-${sliderPosition}px)` }">
        <div class="g-carousel-item" v-for="(item, index) in elements" :key="index">
          <g-student-item :enrollment="item"/>
        </div>
      </div>
    </div>
    <div class="g-carousel-arrow prev" @click="moveSlider(-1)" v-if="showPrev">
      <i class="bi bi-chevron-left"></i>
    </div>
    <div class="g-carousel-arrow next" @click="moveSlider(1)" v-if="showNext && showNextInit">
      <i class="bi bi-chevron-right"></i>
    </div>
  </div>
</template>

<script>
import GStudentItem from "./GStudentItem.vue";
export default { name: "GStudentCarousel",
  components: {GStudentItem,},
  props:{
    elements:{
      type:Array,
      required:true
    }
  },
  data() {
    return {
      items: [],
      sliderPosition: 0,
      itemWidth: 250,
      visibleItems: 5,
      showPrev:false,
      showNext:true
    };
  },
  methods: {
    moveSlider(direction) {
      const { elements, sliderPosition, itemWidth, visibleItems } = this;
      const maxPosition = (elements.length - visibleItems) * itemWidth;
      let newPosition = sliderPosition + direction * itemWidth;
      console.log('newPosition',newPosition);
      console.log('maxPosition',maxPosition);
      newPosition = Math.max(0, Math.min(maxPosition, newPosition));
      this.sliderPosition = newPosition;
      console.log('sliderPosition',this.sliderPosition);
      if(newPosition ==0){
        this.showPrev= false;
      }else{
        this.showPrev =true;
      }
      if(newPosition >= maxPosition){
        this.showNext= false;
      }else{
        this.showNext = true;
      }
    },
  },
  computed:{
  showNextInit(){
    return this.elements && this.elements.length > this.visibleItems;
  }
  },
  watch:{
  elements(value){
    this.items = value;
    console.log('student',this.items);
  }
  }
};
</script>

<style>
.g-carousel-container_s {
  width: 100%;
  position: relative;
  overflow: visible;
}

.g-carousel-content-wrapper {
  display: flex;
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
}

.g-carousel-content {
  padding: 0.5em 0;
  display: flex;
  transition: transform 0.3s ease-in-out;
  z-index: 1;

}

.g-carousel-item {
  width: 250px;
  margin-right: 20px;
}

.g-carousel-item img {
  max-width: 100%;
}

.g-carousel-arrow {
  width: 40px;
  height: 40px;
  position: absolute;
  top: calc(50% - 20px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
}

.g-carousel-arrow.prev {
  left: -1.5rem;
}

.g-carousel-arrow.next {
  right: -1.5rem;
}

.g-carousel-arrow i {
  color: white;
  font-size: 1.4rem;
  padding: 3em;
}
</style>