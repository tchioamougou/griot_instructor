<template>
  <div>
    <!-- header course details -->
    <div class="fixed-top g-Header-shadow">
      <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
          <div>
            <a href="#" class="navbar-brand g-border-right pe-2"><img class="g-logo"
                src="../../assets/images/logo/GRIOT-withe-v1.png" alt="..." /></a>
            <span class="navbar-brand">
              {{
                $t("createNewCourse_Step", {
                  currentStep: step,
                  totalStep: maxStep,
                })
              }}
            </span>
          </div>
          <button type="button" class="btn btn-light g-btn" @click="cancel()" title="Cancel course creation"
            :disabled="isSaving">
            {{ $t("cancel_btn") }}
          </button>
        </div>
      </nav>
      <div class="progress" style="height: 3px">
        <div class="progress-bar" role="progressbar" :style="progressionStyle" aria-valuenow="" aria-valuemin="0"
          aria-valuemax="100"></div>
      </div>
    </div>
    <!-- container of all data -->
    <div>
      <div class="step">
        <!-- step 1-->
        <div v-if="step === 1" class="g-step">
          <div class="row justify-content-center mb-2 mt-2">
            <div class="col-12">
              <h2>{{ $t("createNewCourse_Step1_Title") }}</h2>
            </div>
            <div class="col-12">
              <div class="row justify-content-center">
                <div class="col-md-3 col-sm-5 g-course-create-flow-card p-3 me-2 mb-3 bg-light"
                  @click="selectCourseType('Course')" ref="course">
                  <p class="g-heading">{{ $t("createNewCourse_Course") }}</p>
                  <span class="g-text-sm">{{
                    $t("createNewCourse_Course_description")
                  }}</span>
                </div>
                <div class=" col-md-3 col-sm-5 g-course-create-flow-card p-3 mb-3 bg-light"
                  @click="selectCourseType('PracticeTest')" data-id="PracticeTest" ref="practiceTest">
                  <p class="g-heading">
                    {{ $t("createNewCourse_practiceTest") }}
                  </p>
                  <span class="g-text-sm">{{
                    $t("createNewCourse_practiceTest_description")
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- step 2-->
        <div v-if="step === 2" class="g-step">
          <div class="row justify-content-center mb-2 mt-2">
            <div class="col-md-10 col-lg-10 col-xl-10 col-sm-12">
              <h2>{{ $t("createNewCourse_Step2_Title") }}</h2>
              <h3>
                {{ $t("createNewCourse_Step2_Description") }}
              </h3>
              <div class="mt-2">
                <g-input type="text" placeholder="e.g. Learn Photoshop CS6 from Scratch" v-model="courseTitle" :max="60"
                  :show-rest="true" />
              </div>
            </div>
          </div>
        </div>
        <!-- step 3-->
        <div v-if="step === 3" class="g-step">
          <div class="row justify-content-center mb-2 mt-2">
            <div class="col-md-10 col-lg-10 col-xl-10 col-sm-12">
              <h2>{{ $t("createNewCourse_Step3_Title") }}</h2>
              <h3>
                {{ $t("createNewCourse_Step3_Description") }}
              </h3>
              <g-select :options="categoriesOptions" v-model="courseCategory" />
              <h3 v-if="courseCategory">
                {{ $t("createNewCourse_Step3_Description") }}
              </h3>
              <g-select :options="courseSubCategoryOptions" v-model="courseSubCategory" v-if="courseCategory" />
            </div>
          </div>
        </div>
        <!-- step 4-->
      </div>
    </div>
    <!-- fixed footer navigation on the step process -->
    <div>
      <nav class="navbar fixed-bottom navbar-light bg-light g-footer-shadow">
        <div class="container-fluid">
          <button type="button" class="btn btn-outline-secondary" v-if="step !== 1" @click="step--"
            title="Previous step" :disabled="isSaving">
            {{ $t("previous_btn") }}
          </button>
          <span v-if="step === 1"></span>
          <button type="button" class="btn btn-dark" :disabled="canNotContinue || isSaving" @click="step++"
            v-if="this.step !== maxStep" title="Next stap">
            {{ $t("continue_btn") }}
          </button>
          <button type="button" class="btn btn-dark" :disabled="canNotContinue || isSaving" @click="createCourse()"
            v-if="this.step === maxStep" title="create course">
            <spinner-cmp v-if="isSaving" />
            {{ $t("createNewCourse_button_label") }}
          </button>
        </div>
      </nav>
    </div>
  </div>
  <g-toast ref="message" :duration="10000" direction="top-right" />
</template>

<script>
import * as GR_CONST from "../../resources/utilityConstant";
import router from "../../router";
import { useStore } from "vuex";
import createStore from "../../store.js";
import { retrieveDataWithFilter } from "../../firebase/firestore.js";
import GInput from "../../resources/GInput.vue";
import SpinnerCmp from "../../resources/Spinner.vue";
import GToast from "../../resources/GToast.vue";
import GSelect from "../../resources/GSelect.vue";
import {
  generateReferralCode,
  sendGriotEmail,
} from "../../resources/UtilityFunction";
import { COLLECTION_NAME } from "../../resources/utilityConstant";
import store from "../../store.js";
import { createCourses } from "../../database/griot";

export default {
  name: "CreateNewCourse",
  components: { GSelect, GToast, GInput, SpinnerCmp },
  data: function () {
    return {
      step: 1,
      maxStep: 3,
      courseType: null,
      courseTitle: null,
      categoriesOptions: [],
      courseCategory: "",
      courseSubCategory: "",
      store: useStore(),
      alert: null,
      isSaving: false,
      courseSubCategoryOptions: [],
    };
  },
  methods: {
    selectCourseType(type) {
      if (type === "Course") {
        this.$refs.course.classList.add("g-border-selected");
        this.$refs.practiceTest.classList.remove("g-border-selected");
      } else if (type === "PracticeTest") {
        this.$refs.practiceTest.classList.add("g-border-selected");
        this.$refs.course.classList.remove("g-border-selected");
      }
      this.courseType = type;
    },
    cancel() {
      router.push("/instructor/courses");
    },
    createCourse() {
      this.isSaving = true;
      let course = {
        type: this.courseType,
        title: this.courseTitle,
        categories: this.categoriesOptions.filter(
          (e) => e.id === this.courseCategory
        )[0].id,
        subCategory: this.courseSubCategoryOptions.filter(
          (e) => e.id === this.courseSubCategory
        )[0].id,
        status: GR_CONST.COURSE_STATUS.unpublished,
        instructorId: this.user.id,
        referralCode: generateReferralCode(),
        subTitle: "",
      };
      console.log("course record", course);
      course.InstructorID = createStore.state.user.firebaseId;
      createCourses([course])
        .then((response) => {
          console.log("response", response);
          return response.json();
        })
        .then((data) => {
          console.log("data", data);
          course = data[0];
          this.isSaving = false;
          this.alert.toast("success", "Created", "success");
          let sender = {
            message:
              "Your course " + course.title + " have been successfully Created",
          };
          let recipient = {
            fullName: course.instructor.name,
            email: course.instructor.email,
          };
          router.push({
            name: "editCourse",
            params: { courseId: data[0].id, item: "IntendedLearners" },
          }).then(() => { window.location.reload(); });
          this.sendEmailToCourseInstructor(sender, recipient);
        })
        .catch((error) => {
          this.isSaving = false;
          this.alert.toast(
            "error",
            "Unknown error: Retry again later",
            "error"
          );
          console.log(error);
        });
    },
    sendEmailToCourseInstructor(sender, recipient) {
      sendGriotEmail(recipient.email, "Create new course", sender.message);
    },
    async retrieveCategory() {
      await retrieveDataWithFilter(COLLECTION_NAME.categories, null, null)
        .then((result) => {
          this.categoriesOptions = result.map((e) => {
            return { ...e, name: e.title, value: e.id, };
          });
          this.categoriesOptions.push({ name: "I don't know yet", value: "0" });
          this.courseCategory = this.categoriesOptions[0].value;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
  computed: {
    canNotContinue() {
      if (this.step === 1 && this.courseType) return false;
      if (this.step === 2 && this.courseTitle) return false;
      if (this.step === 3 && this.courseCategory) return false;
      if (this.step >= this.maxStep) return true;
      return true;
    },
    progressionStyle() {
      if (this.step === 1) return "width: 33%";
      if (this.step === 2) return "width: 66%";
      if (this.step === 3) return "width: 100%";
      return "0%";
    },
    user() {
      return store.state.user;
    },
  },
  mounted() {
    this.alert = this.$refs.message;
  },
  created() {
    this.retrieveCategory();
  },
  watch: {
    courseCategory(value) {
      console.log(value);
      if (value) {
        const cat = this.categoriesOptions.filter((e) => e.id === value)[0];
        this.courseSubCategoryOptions = cat.subItems.map((e) => {
          return { ...e, name: e.title, value: e.id, };
        });
        this.courseSubCategory = this.courseSubCategoryOptions[0].value
      }
    },
  },
};
</script>

<style scoped>
.g-course-create-flow-card {
  border: 1px gray solid;
  cursor: pointer;
}

.g-heading {
  font-size: larger;
  text-align: center;
  font-weight: bolder;
}

.g-text-sm {
  text-align: center;
  font-size: larger;
}

.g-step {
  text-align: center;
  padding-top: 15%;
}

h2 {
  font-weight: bolder;
}

.g-footer-shadow {
  border: 1px solid #202020;
  -webkit-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
}

.g-Header-shadow {
  border: 0px solid #202020;
  -webkit-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  box-shadow: 3px 2px 3px rgba(50, 50, 50, 0.75);
}

.g-border-right {
  border-right: 2px gray solid;
}

.g-btn {
  color: var(--g-c-blue-dark);
  font-weight: bolder;
  font-size: larger;
}

.g-border-selected {
  border: 5px black solid;
}

.btn {
  border-radius: 0px !important;
}

.form-select {
  border-radius: 0px !important;
  outline: 0px;
}

select#xyz {
  border: 0px;
  border-radius: 0px !important;
}

.step {
  margin: 12px;
  margin-top: 0px;
}

/** manage responsive on the project ***/
@media only screen and (max-width: 768px) {
  .g-step {
    text-align: center;
    padding-top: 30%;
  }
}

@media only screen and (min-width: 768px) and (max-width: 1200px) {
  .g-step {
    text-align: center;
    padding-top: 30%;
  }
}

@media only screen and (min-width: 1201px) {
  .g-step {
    text-align: center;
    padding-top: 15%;
  }
}

.progress {
  border-radius: 0 !important;
}

.navbar-brand {
  font-size: 1.2em;
}

.btn {
  font-size: 1.2em;
}

.bg-light {
  background-color: white !important;
  ;
}
</style>
