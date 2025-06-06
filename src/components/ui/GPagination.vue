<template>
  <div
      class="d-sm-flex justify-content-sm-between align-items-sm-center mt-3"
  >
    <!-- Content -->
    <p class="mb-0 text-center text-sm-start gd-md" >
      Showing {{ (currentPage - 1) * pageSize + 1 }} to
      {{ page< totalPage? page* pageSize:totalElements }} of {{ totalElements }} entries
    </p>
    <!-- Pagination -->
    <nav class=" " aria-label="navigation">
      <ul
          class="pagination justify-content-end"
      >
        <!-- button Preview-->
        <li class="g-form-control_page">
              <span
                  class="g-button-page_navigation"
                  tabindex="-1"
                  @click="previous()"
              >
                <i class="bi bi-chevron-left"></i> <span>previous</span>
              </span>
        </li>
        <!-- go to page-->
        <li class="g-form-control_page" v-if="page >= 3">
              <span class="g-button-page" >
                   ...
              </span>
        </li>
        <li class="g-form-control_page" v-for="i in pageTab.slice(startPage-1,endPage)" :key="i">
              <span :class="i===page?'g-button-page active':'g-button-page'"  @click="selectPage(i)"  >
                    {{ i }}
              </span>
        </li>
        <li class="g-form-control_page" v-if="page < totalPage && endPage!=totalPage">
              <span class="g-button-page" >
                   ...
              </span>
        </li>
        <!-- button next-->
        <li class="g-form-control_page">
              <span
                  class="g-button-page_navigation"
                  @click="next()"
              >
                <span>Next</span><i class="bi bi-chevron-right"></i>
              </span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
export default {
  name: "GPagination",
  emits:["update:modelValue"],
  props:{
    modelValue: {type:Number},
    totalPage: {
      type:Number,
      required:true
    },
    currentPage:  {
      type:Number,
      required:true
    },
    totalElements:{
      type:Number,
      required:true
    },
    pageSize:  {
  type:Number,
      required:true
},
  },
  data:function(){
    return {
      page:null,
      startPage:0,
      endPage:0,
      pageTab:[]
    }
  },
  methods:{
    startPageF(){
      if(this.totalPage <=3 || this.page <2){
        return 1;
      }else  if (this.page >= this.totalPage - 1){
        return this.totalPage- 2;
      }else {
        return this.page - 1;
      }
    },
    endPageF (){
      if(this.totalPage <=3){
        return this.totalPage
      }else  if (this.page >= this.totalPage - 1){
        return this.totalPage;
      }else if(this.page ==1){return 3}else{
        return this.page + 1;
      }
    },
    selectPage(page){
      this.$emit('update:modelValue',page);
      if(page === this.page){
        this.page = page;
      }else{
        this.page = page;
      }

      this.startPage = this.startPageF();
      this.endPage=this.endPageF();
    },
    previous() {
      if(this.page !== 1){
        this.page -=1;
        this.selectPage(this.page)
      }
    },
    next() {
      if(this.page < this.totalPage){
        this.page +=1;
        this.selectPage(this.page)
      }
    },
  },
  mounted() {
    for(let i =1; i<=this.totalPage;i++){
      this.pageTab.push(i);
    }
    this.page = this.currentPage;
    this.selectPage(this.page);
  }

}
</script>

<style scoped>

.active{
  background-color: var(--g-c-blue-dark);
  color: white;
  font-weight: 900;
}
.g-button-page_navigation:hover{
  background-color: var(--g-c-blue-dark);
  color: var(--bs-white);
  font-weight: 900;
}
.g-button-page_navigation{
cursor: pointer;
  border: solid 0.01em var(--bs-dark);
  height: 100%;
  text-transform: capitalize;
  padding: 0.5em;
}
.g-form-control_page {
  height: 1em;
  padding-left: 0.5em;
  padding-right: 0.5em;
  color: var(--g-c-text-home);
  margin-top: 0.5em;
  margin-bottom: 0.1em;
  border-radius: 0;
  cursor: pointer;
}
</style>