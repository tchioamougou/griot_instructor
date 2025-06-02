<template>
  <div class="card g-box-shadow">
    <div class="card-body">
      <div class="g-block-header">
        <div class="block_title">
          <h5 class="g-title">{{ $t('Pricing') }}</h5>
        </div>
      </div>
      <template v-if="loading">
        <g-spinner />
      </template>
      <template v-if="!loading">
        <div class="g-container">
          <div class="g-tip">
            <div class="title important">
              <i class="bi bi-patch-exclamation-fill"></i> {{ $t('important') }}
            </div>
            <div class="list">
              <ul>
                <li>
                  {{ $t('pri.l1') }}
                </li>
                <li>{{ $t('pri.l2') }}</li>
              </ul>
            </div>
          </div>
          <div class="mt-5">
            <input type="radio" id="Standard" value="Standard" v-model="localCoursePricing.type" class="ms-4 me-2"
              :disabled="isSaving" />
            <label for="Standard">{{ $t('Standard') }}</label>

            <input type="radio" id="Custom" value="Custom" v-model="localCoursePricing.type" class="ms-4 me-2"
              :disabled="isSaving" />
            <label for="Custom">{{ $t("Custom") }}</label>
          </div>
          <div class="g-pricing-line mt-4">
            <div class="currency">
              <g-select :options="currencyOptions" v-model="currency" :disabled="isSaving" />
            </div>
            <div class="value">
              <g-select :options="pricingOptions" v-if="localCoursePricing.type === 'Standard'"
                v-model="localCoursePricing.price" :disabled="isSaving" />
              <g-input type="Number" v-if="localCoursePricing.type === 'Custom'" v-model="localCoursePricing.price"
                :disabled="isSaving" />
            </div>
            <div class="action">
              <button class="g-button" @click="updateCoursePrice">
                <spinner-cmp v-if="isSaving" />
                {{ $t('save') }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <g-toast ref="message" :duration="10000" direction="top-right" />
</template>
<script setup>
import GSelect from "../../resources/GSelect.vue";
import GInput from "../../resources/GInput.vue";
import GSpinner from "../../resources/GSpinner.vue";
import SpinnerCmp from "../../resources/Spinner.vue";
import GToast from "../../resources/GToast.vue";
import { computed, ref, watch } from "vue";
import { CURRENCY_CODE, CURRENCY_OB, DOLLAR_Rate } from "../../resources/commonCurrency";
import { STANDARD_PRICING_OPTIONS } from "../../resources/utilityConstant";
import { coursesPricing } from "../../database/griot";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emits = defineEmits(['refresh'])
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});
const localCoursePricing = ref({});
const currency = ref("XAF");
const isSaving = ref(false);
const message = ref(null);
const loading = ref(false)
const currencyOptions = ref(
  CURRENCY_OB.map((e) => {
    return { ...e, originalName: e.name, name: e.code, value: e.code };
  })
);
const pricingOptions = computed(() => {
  const currencyLocal = CURRENCY_CODE[currency.value].symbol.toLocaleLowerCase();
  return STANDARD_PRICING_OPTIONS.map(e => {
    return {
      ...e, name: e[currencyLocal] === 0 ? "Free" : (CURRENCY_CODE[currency.value].symbol + ' ' + e[currencyLocal]),
      value: e[currencyLocal]
    }
  });
});
const updateCoursePrice = () => {
  if (
    localCoursePricing.value.type &&
    localCoursePricing.value.price &&
    currency.value
  ) {
    isSaving.value = true;
    const cur = currencyOptions.value.filter(
      (e) => e.value === currency.value
    )[0];
    const request = {
      "id": props.course.price?.id,
      "type": localCoursePricing.value.type,
      "currencySymbol": cur.symbol,
      "value": localCoursePricing.value.price,
      "currencyName": cur.name,
      "currencyCode": cur.code,
    }
    coursesPricing(props.course.id, request)
      .then((response) => {
        response.json();
      })
      .then((result) => {
        message.value.toast(t('Price'), t("save_price_ms"), "success");
        isSaving.value = false;
        emits('refresh');
      })
      .catch((e) => {
        message.value.toast(t('Price'), t('error_occur'), "error");
        isSaving.value = false;
      });
  }
};
const init = () => {
  if (props.course.price) {
    localCoursePricing.value.price = props.course.price.value;
    localCoursePricing.value.type = props.course.price.type;
    currency.value = props.course.price.currencyCode;
  }
}
watch(() => props.course,
  (value) => { init() });
init()
</script>
<style scoped>
.g-pricing-line {
  display: flex;
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

input[type="checkbox"]:checked:focus {}

input[type="radio"]:disabled {
  cursor: not-allowed;
}

.g-pricing-line .currency {
  margin-right: 1em;
}

.g-pricing-line .value {
  margin-right: 1em;
}

.g-pricing-line .action {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
