<template>
  <ItemLayout :title="$t('Pricing')" >
    <template #main>
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
              <BaseSelect :options="currencyOptions" v-model="currency" :disabled="isSaving" />
            </div>
            <div class="value">
              <BaseSelect :options="pricingOptions" v-if="localCoursePricing.type === 'Standard'"
                v-model="localCoursePricing.price" :disabled="isSaving" />
              <BaseInput type="Number" v-if="localCoursePricing.type === 'Custom'" v-model="localCoursePricing.price"
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
  </ItemLayout>

</template>
<script lang="ts" setup>
import GSpinner from "@/components/ui/GSpinner.vue";

import { computed, ref, watch } from "vue";
import { CURRENCY_CODE, CURRENCY_OB, DOLLAR_Rate } from "@/utilities/commonCurrency";
import { STANDARD_PRICING_OPTIONS } from "@/utilities/utilityConstant";
import { coursesPricing } from "@/services/griot_service";
import { useI18n } from "vue-i18n";
import BaseInput from "@/components/forms/FormElements/BaseInput.vue";
import BaseSelect from "@/components/forms/FormElements/BaseSelect.vue";
import ItemLayout from "./items/ItemLayout.vue";


const { t } = useI18n();

const emits = defineEmits<{
  (e: 'refresh'): void;
}>();

const props = defineProps<{
  course: Record<string, any>; // Assuming course is an object with a price property
}>();

const localCoursePricing = ref<Record<string, any>>({});
const currency = ref<string>("XAF");
const isSaving = ref<boolean>(false);
const message = ref<any>(null); // GToast might expose a proper type you could use instead of any
const loading = ref<boolean>(false);

const currencyOptions = ref<Record<string, any>[]>(
  CURRENCY_OB.map((e) => {
    return { ...e, originalName: e.name, label: e.code, value: e.code };
  })
);

const pricingOptions = computed(() => {
  const currencyLocal = CURRENCY_CODE[currency.value as keyof typeof CURRENCY_CODE].symbol.toLocaleLowerCase();
  return STANDARD_PRICING_OPTIONS.map((e: any) => {
    const val = e[currencyLocal];
    return {
      ...e,
      name: val === 0 ? "Free" : `${CURRENCY_CODE[currency.value as keyof typeof CURRENCY_CODE].symbol} ${val}`,
      value: val,
    };
  });
});

const updateCoursePrice = () => {
  if (
    localCoursePricing.value.type &&
    localCoursePricing.value.price !== undefined &&
    currency.value
  ) {
    isSaving.value = true;

    const cur = currencyOptions.value.find(e => e.value === currency.value);
    if (!cur) return;

    const request = {
      id: props.course.price?.id,
      type: localCoursePricing.value.type,
      currencySymbol: cur.symbol,
      value: localCoursePricing.value.price,
      currencyName: cur.name,
      currencyCode: cur.code,
    };

    coursesPricing(props.course.id, request)
      .then((response: Response) => response.json())
      .then(() => {
        message.value.toast(t('Price'), t("save_price_ms"), "success");
        isSaving.value = false;
        emits('refresh');
      })
      .catch(() => {
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
};

watch(() => props.course, () => {
  init();
});

init();
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
