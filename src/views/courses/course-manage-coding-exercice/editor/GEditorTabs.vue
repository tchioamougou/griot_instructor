<template>

  <div class="g-tabs ">
    <div class="ms-4"></div>
    <template v-for="tab in tabs">
      <div class="g-tab g-heading-sm" @click="selectTab(tab)" :ref="tab.name">
        {{$t( tab.label )}}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  emits: ["selected"],
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  methods: {
    selectTab(tab) {
      let element = this.$refs[tab.name][0];
      let parent = element.parentNode,
          innerTabs = parent.querySelectorAll(".g-tab");
      innerTabs?.forEach((e) => {
        e.classList.remove("g-tab-active");
      });
      element.classList.add("g-tab-active");
      this.$emit("selected", tab);
    },
    gotoTab(value) {
      if (value) {
        let element = this.$refs[value][0];
        let parent = element.parentNode,
            innerTabs = parent.querySelectorAll("g-tab");

        for (let index = 0, iLen = innerTabs.length; index < iLen; index++) {
          innerTabs[index].classList.remove("g-tab-active");
        }
        element.classList.add("g-tab-active");
      }
    },
  },
};
</script>

<style scoped>
.g-tabs {
  display: flex;
  border-bottom: 0.08em solid var(--griot-gray-600);
  font-family: sans-serif;
  background-color: var(--griot-black);
  color: var(--griot-white);
  overflow: hidden!important;
}
.g-tab {
  padding: 0.5em 0em;
  opacity: 0.75;
  cursor: pointer;
  margin-right: 0.75em;
}
.g-tab:hover {
  opacity: 1;
  background-color: rgb(169, 169, 169,0.1);
}
.g-tab-active {
  border-bottom: 0.01em solid var(--griot-white);
  opacity: 1;
  font-weight: 700;
}
</style>
