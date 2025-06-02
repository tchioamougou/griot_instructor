<template>
  <div
    :class="
      'g_question_review_item ' + (index % 2 == 0 ? 'bkg-gray' : 'bkg-white')
    "
  >
    <div class="g_question_review_item--question">
      <div class="question_number">
        {{$t('Question')}} {{ index }}:
        <span class="tag_review" v-if="record.markAsReview">{{$t('Review')}}</span>
        <span class="tag_skipped" v-if="record.skipped">{{$t('Skipped')}}</span>
        <i
          class="bi bi-check-circle-fill green"
          v-if="record.responseCorrect"
        ></i>
        <i
          class="bi bi-x-circle-fill red"
          v-if="!record.responseCorrect && !record.skipped"
        ></i>
      </div>
      <div class="question" v-html="record.content"></div>
    </div>
    <div class="g_question_review_item--response">
      <template v-for="(res, i) in record.responses" :key="i">
        <div
          :class="
            'response_item ' +
            (res.choice ? 'bkg-green' : res.isCorrect ? 'bkg-red' : '')
          "
        >
          <div class="input">
            <input
              type="radio"
              :name="'answer_input_'+index"
              :id="'In' + index"
              v-if="record.type === 'Choice'"
              :checked="res.isCorrect"
              :disabled="true"
            />
            <label class="label" v-html="res.content"  v-if="record.type === 'Choice'">
            </label>
            <input
              type="checkbox"
              name="answer_input"
              :disabled="true"
              :id="'In_' + i"
              v-model="res.isCorrect"
              v-if="record.type === 'Select'"
            />
            <label class="label" :for="'In' + index" v-html="res.value" v-if="record.type === 'Select'">
            </label>
          </div>
          <div class="correct" v-if="res.correct">(correct)</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuestionReviewItem",
  props: {
    record: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.g_question_review_item {
  padding: 1em 2em;
}
.response_item {
  border: 0.1em solid black;
  padding: 0.5em 1em;
  display: flex;
  flex-direction: row;
  margin: 0.5em 0;
  justify-content: space-between;
}

.label {
  margin-left: 0.75em;
}
input[type="radio"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 1px solid #0a0809;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  outline: none;
  position: relative;
  transition: border-color 0.3s ease-in-out;
}
input[type="radio"]:checked:before {
  content: "";
  width: 10px;
  height: 10px;
  background-color: black;
  position: absolute;
  color: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  font-size: 5px;
  line-height: 5px;
  text-align: center;
}

input[type="checkbox"]:checked:focus {
}

input[type="radio"]:disabled {
  cursor: not-allowed;
}

input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 1px solid #0a0809;
  border-radius: 0px;
  width: 16px;
  height: 16px;
  outline: none;
  position: relative;
  transition: border-color 0.3s ease-in-out;
}

input[type="checkbox"]:checked:before {
  content: "\2713";
  width: 16px;
  height: 16px;
  background-color: black;
  position: absolute;
  color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-bottom: 0px;
  display: block;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
}

input[type="checkbox"]:focus {
  border-color: blue;
}

input[type="checkbox"]:checked:focus {
}

input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 1;
}
.bkg-gray {
  background-color: hsl(198, 24%, 42%, 0.05);
}
.correct {
  color: darkgreen;
  font-weight: 700;
  text-transform: capitalize;
  font-size: 0.9em;
}
.bkg-green {
  background-color: rgb(0, 100, 0, 0.08);
}
.question_number {
  margin: 0.2em 0;
}
.question {
  margin: 1em 0;
}
.tag_review {
  background-color: rgb(128, 128, 128, 0.8);
  padding: 0.25em 0.5em;
  font-size: 0.9em;
  margin: 0 0.5em;
}
.tag_skipped {
  background-color: rgb(199, 21, 133, 0.8);
  padding: 0.25em 0.5em;
  font-size: 0.9em;
}
.bkg-red {
  background-color: rgb(255, 0, 0, 0.3);
}
i.green {
  color: green;
}
i.red {
  color: red;
}
</style>
