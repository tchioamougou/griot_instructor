<template>
  <div class="card g-box-shadow">
    <div class="card-body">
      <div class="g-block-header">
        <div class="block_title">
          <h4 class="g-title">{{ $t('setup.title') }}</h4>
        </div>
      </div>
      <div class="g-container">
        <h1 class="mb-4 mt-5">{{ $t('setup.title') }}</h1>
        <p>
          {{ $t('setup.p_1') }}
        </p>

        <h2>{{ $t('setup.h2_1') }}</h2>

        <p>
          {{ $t('setup.p_2') }}
        </p>

        <ul>
          <li>
            {{ $t('setup.li_1') }}
          </li>
          <li>
            {{ $t('setup.li_2') }}
          </li>
          <li>
            {{ $t('setup.li_3') }}
          </li>
          <li>
           {{ $t('setup.li_4') }}
          </li>
          <li>
            {{ $t('setup.li_5') }}
          </li>
        </ul>

        <h2>{{$t('setup.h2_2')}}</h2>

        <p>{{$t('setup.p_3')}}</p>

        <h3>{{$t('setup.h3_1')}}</h3>

        <p>
          {{$t('setup.p_4')}}
        </p>

        <h3>{{$t('setup.h3_2')}}</h3>

        <p>{{$t('setup.p_5')}}
        </p>

        <h3>{{$t('setup.h3_3')}}</h3>

        <p>
          {{$t('setup.p_6')}}
        </p>

        <h3>{{$t('setup.h3_4')}}</h3>

        <p>
          {{$t('setup.p_7')}}
        </p>

        <h2 class="mt-5">
          {{ $t('setup.cs_title') }}
        </h2>

        <ul>
          <li>
            <strong>{{ $t('setup.cs_li_1') }}</strong> {{ $t('setup.cs_li_1_des') }}
          </li>
          <li>
            <strong>{{ $t('setup.cs_li_2') }}</strong> {{ $t('setup.cs_li_2_des') }}
          </li>
          <li>
            <strong>{{ $t('setup.cs_li_3') }}</strong> {{ $t('setup.cs_li_3_des') }}
          </li>
          <li>
            <strong>{{ $t('setup.cs_li_5') }}</strong> {{ $t('setup.cs_li_5_des') }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { coursesStep } from "../../database/griot";
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["refresh"]);
if (!props.course.courseSetupTestStep) {
  coursesStep(props.course.id, "SetupTestVideo")
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      emits("refresh");
    })
    .catch((error) => {
      console.log("error==>coursesStep", error);
    });
}
coursesStep();
</script>
<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: bold;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
    font-weight: bold;
    margin-top: 2rem;
}
h3{
    font-weight: bold;
}
p {
  line-height: 1.5;
}

ul {
  list-style-type: disc;
  margin-left: 20px;
}

img {
  width: 100%;
  max-height: 300px;
  margin-bottom: 10px;
}
</style>
