<template>
  <div class="g-dropdown">
    <label :class="(disabled?'disabled':'')+' g-dropdown-label'">
      <span :class="labelClass">{{ selectedOption.label }}</span>
      <span><i class="bi bi-chevron-down"></i></span>
    </label>
    <div :class="disabled?'hide':'g-dropdown-content'">
      <div class="g-dropdown-list">
        <div class="g-dropdown-list_item" v-for="op in options" :key="op.value" @click="select($event,op)">
          {{ op.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "GDropdown",
  emits:["update:modelValue","selected"],
  props:{
    options:{
      type:Array,
      required:true,
    },
    disabled:{
      type:Boolean
    },
    modelValue: {type:String},
    labelClass:{
      type:String,
      default:'normal'
    }
  },
  data:function (){
    return{
      selectedOption: {} as any,
    }
  },
  methods:{
    select(event:any,op:any){
      this.selectedOption = op;
      const el = event.target;
      const items =document.querySelectorAll('.g-dropdown-list_item');
      items.forEach((e)=>{
        e.classList.remove('g-dropdown-list_item_active');
      });
      el.classList.add('g-dropdown-list_item_active');
      this.$emit('update:modelValue',op.value);
      this.$emit('selected',op.value);
    }
  },
  mounted() {
    this.selectedOption = this.options[0];
    this.$emit('update:modelValue',this.selectedOption.value);
  }
};
</script>

<style scoped>
.g-dropdown {
  position: relative;
  display: inline;
  cursor: pointer;
  font-family: sans-serif;
}
.g-dropdown-label {
  padding: 1em;
  padding-top: 0;
  margin: 0;
  cursor: pointer;
}
.g-dropdown-label .normal{
  font-weight: 900;
}
.g-dropdown-label .large{
  font-weight: 900;
  font-size: 1.7em;
}
.g-dropdown-label i{
  margin-left:1em ;
}
.g-dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
  z-index: 1;
  margin-top: 0.1em;
  left: 0;
}

.g-dropdown:hover .g-dropdown-content {
  display: block;
}
.g-dropdown-list {
  display: flex;
  flex-direction: column;
}
.g-dropdown-list_item {
  padding: 0.25em 0;
  font-family: sans-serif;
}
.g-dropdown-list_item:hover{
  color: var(--g-color-item);
  font-weight: 700;
}
.g-dropdown-list_item_active{
  color: var(--g-color-item);
  font-weight: 700;
}
.disabled{
  color: gray !important;
  cursor: not-allowed;
}
.hide{
  display: none;
}
.medium{
  font-weight: 900;
  font-size: 1em;
}
</style>
